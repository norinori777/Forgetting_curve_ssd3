import { Router } from "express";
import { requireHttps } from "../middleware/requireHttps.js";
import { loginValidationMiddleware } from "./loginValidationMiddleware.js";
import { LoginController } from "./loginController.js";

export const buildLoginRoutes = (controller: LoginController): Router => {
  const router = Router();

  router.post("/login", requireHttps, loginValidationMiddleware, controller.handle);

  return router;
};