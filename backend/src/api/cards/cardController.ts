import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import type { CardDraftRequest } from "../../domains/cards/CardModels.js";
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
}