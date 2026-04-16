import type { CardCreateResponse, CardDraftRequest, CardErrorCode, CardFieldErrors, CardPreviewResponse } from "../../domains/cards/CardModels.js";
import { validateCardDraft } from "../../domains/cards/CardModels.js";
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
}