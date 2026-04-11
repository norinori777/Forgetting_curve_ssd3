import "dotenv/config";
import express from "express";
import { buildLoginRoutes } from "./api/auth/loginRoutes.js";
import { buildSignupRoutes } from "./api/auth/signupRoutes.js";
import { LoginController } from "./api/auth/loginController.js";
import { SignupController } from "./api/auth/signupController.js";
import { corsMiddleware } from "./api/middleware/cors.js";
import { createPrismaAuthStore } from "./repositories/auth/authStore.js";
import { LoginRepository } from "./repositories/auth/loginRepository.js";
import { SignupRepository } from "./repositories/auth/signupRepository.js";
import { LoginGuardService } from "./services/auth/LoginGuardService.js";
import { LoginMetricsService } from "./services/auth/LoginMetricsService.js";
import { LoginService } from "./services/auth/LoginService.js";
import { SignupGuardService } from "./services/auth/SignupGuardService.js";
import { SignupMetricsService } from "./services/auth/SignupMetricsService.js";
import { SignupService } from "./services/auth/SignupService.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

const bootstrap = async (): Promise<void> => {
  app.set("trust proxy", true);
  app.use(corsMiddleware);
  app.use(express.json());

  const authStore = await createPrismaAuthStore();
  const signupRepository = new SignupRepository(authStore);
  const loginRepository = new LoginRepository(authStore);
  const signupGuardService = new SignupGuardService();
  const signupMetricsService = new SignupMetricsService();
  const signupService = new SignupService(signupRepository, signupGuardService, signupMetricsService);
  const signupController = new SignupController(signupService, signupMetricsService);
  const loginGuardService = new LoginGuardService();
  const loginMetricsService = new LoginMetricsService();
  const loginService = new LoginService(loginRepository, loginGuardService, loginMetricsService);
  const loginController = new LoginController(loginService);

  app.use("/auth", buildSignupRoutes(signupController));
  app.use("/auth", buildLoginRoutes(loginController));

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
  });
};

void bootstrap().catch((error: unknown) => {
  console.error("Failed to start backend server", error);
  process.exitCode = 1;
});
