import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import type { CardBulkLabelUpdateRequest, CardDraftRequest } from "../../domains/cards/CardModels.js";
import { CardService, CardServiceError } from "../../services/cards/CardService.js";
import { authLogger } from "../../utils/logging/authLogger.js";

type CardAuthLocals = {
  cardAuth?: {
    userId: string;
    sessionId: string;
  };
};

const getRequestId = (req: Request): string => req.headers["x-request-id"]?.toString() ?? randomUUID();

export class CardController {
  constructor(private readonly cardService: CardService) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId(req);
    const locals = res.locals as CardAuthLocals;
    const currentUserId = locals.cardAuth?.userId ?? "";

    try {
      const result = await this.cardService.list({
        currentUserId,
        requestId,
        search: typeof req.query.search === "string" ? req.query.search : undefined,
        labels: this.parseLabels(req.query.labels),
        cursor: typeof req.query.cursor === "string" ? req.query.cursor : undefined,
        limit: this.parseLimit(req.query.limit)
      });

      authLogger.log("info", { event: "card_list_succeeded", requestId, userId: currentUserId });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof CardServiceError) {
        authLogger.log("error", {
          event: "card_list_failed",
          requestId,
          userId: currentUserId,
          errorCode: error.code
        });

        res.status(error.statusCode).json({
          errorCode: error.code,
          message: error.message,
          fieldErrors: error.fieldErrors
        });
        return;
      }

      res.status(500).json({
        errorCode: "CARD_LIST_FAILED",
        message: "カード一覧の取得に失敗しました。再試行してください。"
      });
    }
  };

  bulkLabel = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId(req);
    const locals = res.locals as CardAuthLocals;
    const currentUserId = locals.cardAuth?.userId ?? "";
    const body = req.body as Partial<CardBulkLabelUpdateRequest>;

    try {
      const result = await this.cardService.bulkLabel({
        currentUserId,
        requestId,
        cardIds: Array.isArray(body.cardIds) ? body.cardIds : [],
        labels: Array.isArray(body.labels) ? body.labels : []
      });

      authLogger.log("info", { event: "card_bulk_label_succeeded", requestId, userId: currentUserId });
      res.status(200).json(result);
    } catch (error) {
      this.handleCardActionError(req, res, error, currentUserId, requestId, "card_bulk_label_failed", "CARD_BULK_UPDATE_FAILED", "一括ラベル付与に失敗しました。再試行してください。");
    }
  };

  export = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId(req);
    const locals = res.locals as CardAuthLocals;
    const currentUserId = locals.cardAuth?.userId ?? "";

    try {
      const result = await this.cardService.export({
        currentUserId,
        requestId,
        search: typeof req.query.search === "string" ? req.query.search : undefined,
        labels: this.parseLabels(req.query.labels)
      });

      authLogger.log("info", { event: "card_export_succeeded", requestId, userId: currentUserId });
      res.status(200).json(result);
    } catch (error) {
      this.handleCardActionError(req, res, error, currentUserId, requestId, "card_export_failed", "CARD_EXPORT_FAILED", "カードのエクスポートに失敗しました。再試行してください。");
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const requestId = getRequestId(req);
    const locals = res.locals as CardAuthLocals;
    const currentUserId = locals.cardAuth?.userId ?? "";

    try {
      const result = await this.cardService.delete({
        currentUserId,
        requestId,
        cardId: typeof req.params.cardId === "string" ? req.params.cardId : ""
      });

      authLogger.log("info", { event: "card_delete_succeeded", requestId, userId: currentUserId });
      res.status(200).json(result);
    } catch (error) {
      this.handleCardActionError(req, res, error, currentUserId, requestId, "card_delete_failed", "CARD_DELETE_FAILED", "カードの削除に失敗しました。再試行してください。");
    }
  };

  preview = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, "preview");
  };

  create = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, "create");
  };

  private async handleRequest(req: Request, res: Response, mode: "preview" | "create"): Promise<void> {
    const requestId = getRequestId(req);
    const locals = res.locals as CardAuthLocals;
    const currentUserId = locals.cardAuth?.userId ?? "";
    const draft = req.body as Partial<CardDraftRequest>;

    try {
      if (mode === "preview") {
        const result = await this.cardService.preview({ draft, currentUserId, requestId });
        authLogger.log("info", { event: "card_preview_succeeded", requestId, userId: currentUserId });
        res.status(200).json(result);
        return;
      }

      const result = await this.cardService.create({ draft, currentUserId, requestId });
      authLogger.log("info", { event: "card_create_succeeded", requestId, userId: currentUserId });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof CardServiceError) {
        authLogger.log("error", {
          event: mode === "preview" ? "card_preview_failed" : "card_create_failed",
          requestId,
          userId: currentUserId,
          errorCode: error.code
        });

        res.status(error.statusCode).json({
          errorCode: error.code,
          message: error.message,
          fieldErrors: error.fieldErrors
        });
        return;
      }

      res.status(500).json({
        errorCode: mode === "preview" ? "CARD_PREVIEW_FAILED" : "CARD_CREATE_FAILED",
        message: mode === "preview" ? "プレビューに失敗しました。再試行してください。" : "カードの保存に失敗しました。再試行してください。"
      });
    }
  }

  private parseLabels(value: unknown): string[] | undefined {
    if (typeof value === "string") {
      return value.split(",").map((item) => item.trim()).filter((item) => item.length > 0);
    }

    if (Array.isArray(value)) {
      return value
        .flatMap((item) => (typeof item === "string" ? item.split(",") : []))
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    return undefined;
  }

  private parseLimit(value: unknown): number | undefined {
    if (typeof value !== "string") {
      return undefined;
    }

    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
      return undefined;
    }

    return parsed;
  }

  private handleCardActionError(
    _req: Request,
    res: Response,
    error: unknown,
    currentUserId: string,
    requestId: string,
    failureEvent: string,
    fallbackErrorCode: "CARD_BULK_UPDATE_FAILED" | "CARD_DELETE_FAILED" | "CARD_EXPORT_FAILED",
    fallbackMessage: string
  ): void {
    if (error instanceof CardServiceError) {
      authLogger.log("error", {
        event: failureEvent,
        requestId,
        userId: currentUserId,
        errorCode: error.code
      });

      res.status(error.statusCode).json({
        errorCode: error.code,
        message: error.message,
        fieldErrors: error.fieldErrors
      });
      return;
    }

    res.status(500).json({
      errorCode: fallbackErrorCode,
      message: fallbackMessage
    });
  }
}