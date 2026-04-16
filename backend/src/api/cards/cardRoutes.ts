import { Router } from "express";
import type { AuthStoreState } from "../../repositories/auth/authStore.js";
import { requireHttps } from "../middleware/requireHttps.js";
import { createCardAuthMiddleware } from "../middleware/cardAuth.js";
import { CardController } from "./cardController.js";

export const buildCardRoutes = (controller: CardController, authStore: AuthStoreState): Router => {
  const router = Router();
  const cardAuthMiddleware = createCardAuthMiddleware(authStore);

  router.post("/preview", requireHttps, cardAuthMiddleware, controller.preview);
  router.post("/", requireHttps, cardAuthMiddleware, controller.create);

  return router;
};