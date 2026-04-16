import { Router } from "express";
import { requireHttps } from "../middleware/requireHttps.js";
import { signupValidationMiddleware } from "./signupValidationMiddleware.js";
import { SignupController } from "./signupController.js";

export const buildSignupRoutes = (controller: SignupController): Router => {
  const router = Router();

  router.post("/signup", requireHttps, signupValidationMiddleware, controller.handle);

  return router;
};
