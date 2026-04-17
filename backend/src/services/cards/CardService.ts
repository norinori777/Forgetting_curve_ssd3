import type { CardBulkLabelUpdateResponse, CardCreateResponse, CardDraftRequest, CardDeleteResponse, CardErrorCode, CardExportFilters, CardExportResponse, CardFieldErrors, CardListQuery, CardListResponse, CardPreviewResponse } from "../../domains/cards/CardModels.js";
import { isAllowedCardLabel, normalizeCardLabels, validateCardDraft } from "../../domains/cards/CardModels.js";
import { assertCardOwnership } from "../../api/middleware/cardAuth.js";
import { CardRepository, CardRepositoryError } from "../../repositories/cards/cardRepository.js";
import { computeInitialReviewSchedule } from "../../utils/cards/reviewSchedule.js";

export class CardServiceError extends Error {
  constructor(
    public readonly code: CardErrorCode,
    public readonly statusCode: number,
    message: string,
    public readonly fieldErrors?: CardFieldErrors
  ) {
    super(message);
    this.name = "CardServiceError";
  }
}

type PreviewInput = {
  draft: Partial<CardDraftRequest>;
  currentUserId: string;
  requestId: string;
  now?: Date;
};

type CreateInput = PreviewInput;

type ListInput = {
  currentUserId: string;
  requestId: string;
  search?: string;
  labels?: string[];
  cursor?: string;
  limit?: number;
};

type BulkLabelInput = {
  currentUserId: string;
  requestId: string;
  cardIds: string[];
  labels: string[];
};

type DeleteInput = {
  currentUserId: string;
  requestId: string;
  cardId: string;
};

type ExportInput = {
  currentUserId: string;
  requestId: string;
  search?: string;
  labels?: string[];
};

export class CardService {
  constructor(private readonly repository: CardRepository) {}

  async preview(input: PreviewInput): Promise<CardPreviewResponse> {
    if (!input.currentUserId) {
      throw new CardServiceError("AUTH_REQUIRED", 401, "カード登録にはログインが必要です。");
    }

    assertCardOwnership(input.currentUserId, input.currentUserId);

    const validation = validateCardDraft(input.draft);
    if (!validation.isValid) {
      throw new CardServiceError("VALIDATION_FAILED", 400, "入力内容を確認してください。", validation.fieldErrors);
    }

    return {
      isValid: true,
      reviewSchedule: computeInitialReviewSchedule(input.now ?? new Date())
    };
  }

  async create(input: CreateInput): Promise<CardCreateResponse> {
    if (!input.currentUserId) {
      throw new CardServiceError("AUTH_REQUIRED", 401, "カード登録にはログインが必要です。");
    }

    assertCardOwnership(input.currentUserId, input.currentUserId);

    const validation = validateCardDraft(input.draft);
    if (!validation.isValid) {
      throw new CardServiceError("VALIDATION_FAILED", 400, "入力内容を確認してください。", validation.fieldErrors);
    }

    const reviewSchedule = computeInitialReviewSchedule(input.now ?? new Date());

    try {
      const record = await this.repository.withTransaction(async (tx) => {
        return tx.createCard({
          userId: input.currentUserId,
          requestId: input.requestId,
          draft: validation.normalizedDraft,
          reviewSchedule,
          now: input.now ?? new Date()
        });
      });

      return {
        cardId: record.cardId,
        redirectTo: "/dashboard",
        reviewSchedule
      };
    } catch (error) {
      if (error instanceof CardRepositoryError && error.code === "REQUEST_CONFLICT") {
        throw new CardServiceError("FORBIDDEN", 403, error.message);
      }

      throw new CardServiceError("CARD_CREATE_FAILED", 500, "カードの保存に失敗しました。再試行してください。");
    }
  }

  async list(input: ListInput): Promise<CardListResponse> {
    if (!input.currentUserId) {
      throw new CardServiceError("AUTH_REQUIRED", 401, "カード一覧の表示にはログインが必要です。");
    }

    try {
      const query: CardListQuery = {
        userId: input.currentUserId,
        search: input.search,
        labels: input.labels,
        cursor: input.cursor,
        limit: input.limit
      };

      return this.repository.listCards(query);
    } catch (error) {
      if (error instanceof CardRepositoryError) {
        throw new CardServiceError("CARD_LIST_FAILED", 500, error.message);
      }

      throw new CardServiceError("CARD_LIST_FAILED", 500, "カード一覧の取得に失敗しました。再試行してください。");
    }
  }

  async bulkLabel(input: BulkLabelInput): Promise<CardBulkLabelUpdateResponse> {
    if (!input.currentUserId) {
      throw new CardServiceError("AUTH_REQUIRED", 401, "一括ラベル付与にはログインが必要です。");
    }

    const cardIds = Array.from(new Set(input.cardIds.map((cardId) => cardId.trim()).filter((cardId) => cardId.length > 0)));
    const labels = normalizeCardLabels(input.labels);

    if (cardIds.length === 0 || labels.length === 0) {
      throw new CardServiceError("VALIDATION_FAILED", 400, "一括ラベル付与の対象とラベルを選択してください。");
    }

    const invalidLabel = labels.find((label) => !isAllowedCardLabel(label));
    if (invalidLabel) {
      throw new CardServiceError("VALIDATION_FAILED", 400, "許可されていないラベルがあります。", { labels: `許可されていないラベルがあります: ${invalidLabel}` });
    }

    try {
      const updatedCount = await this.repository.withTransaction(async (tx) => {
        return tx.bulkAddLabels({ userId: input.currentUserId, cardIds, labels });
      });

      return { updatedCount };
    } catch (error) {
      if (error instanceof CardRepositoryError) {
        if (error.code === "CARD_NOT_FOUND") {
          throw new CardServiceError("CARD_NOT_FOUND", 404, error.message);
        }

        if (error.code === "FORBIDDEN") {
          throw new CardServiceError("FORBIDDEN", 403, error.message);
        }
      }

      throw new CardServiceError("CARD_BULK_UPDATE_FAILED", 500, "一括ラベル付与に失敗しました。再試行してください。");
    }
  }

  async delete(input: DeleteInput): Promise<CardDeleteResponse> {
    if (!input.currentUserId) {
      throw new CardServiceError("AUTH_REQUIRED", 401, "カード削除にはログインが必要です。");
    }

    try {
      await this.repository.withTransaction(async (tx) => {
        tx.deleteCard({ userId: input.currentUserId, cardId: input.cardId });
      });

      return { deletedCardId: input.cardId };
    } catch (error) {
      if (error instanceof CardRepositoryError) {
        if (error.code === "CARD_NOT_FOUND") {
          throw new CardServiceError("CARD_NOT_FOUND", 404, error.message);
        }

        if (error.code === "FORBIDDEN") {
          throw new CardServiceError("FORBIDDEN", 403, error.message);
        }
      }

      throw new CardServiceError("CARD_DELETE_FAILED", 500, "カードの削除に失敗しました。再試行してください。");
    }
  }

  async export(input: ExportInput): Promise<CardExportResponse> {
    if (!input.currentUserId) {
      throw new CardServiceError("AUTH_REQUIRED", 401, "カードエクスポートにはログインが必要です。");
    }

    try {
      const filters: CardExportFilters = {
        search: input.search,
        labels: input.labels
      };

      const cards = this.repository.listAllCards({
        userId: input.currentUserId,
        search: input.search,
        labels: input.labels
      });

      return {
        exportedAt: new Date().toISOString(),
        filters,
        cards
      };
    } catch (error) {
      if (error instanceof CardRepositoryError) {
        if (error.code === "FORBIDDEN") {
          throw new CardServiceError("FORBIDDEN", 403, error.message);
        }

        if (error.code === "CARD_NOT_FOUND") {
          throw new CardServiceError("CARD_NOT_FOUND", 404, error.message);
        }
      }

      throw new CardServiceError("CARD_EXPORT_FAILED", 500, "カードのエクスポートに失敗しました。再試行してください。");
    }
  }
}