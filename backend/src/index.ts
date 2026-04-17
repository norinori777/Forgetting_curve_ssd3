import "dotenv/config";
import net from "node:net";
import express from "express";
import { buildLoginRoutes } from "./api/auth/loginRoutes.js";
import { buildSignupRoutes } from "./api/auth/signupRoutes.js";
import { buildCardRoutes } from "./api/cards/cardRoutes.js";
import { LoginController } from "./api/auth/loginController.js";
import { SignupController } from "./api/auth/signupController.js";
import { CardController } from "./api/cards/cardController.js";
import { corsMiddleware } from "./api/middleware/cors.js";
import { createPrismaAuthStore } from "./repositories/auth/authStore.js";
import { LoginRepository } from "./repositories/auth/loginRepository.js";
import { SignupRepository } from "./repositories/auth/signupRepository.js";
import { CardRepository, createPrismaCardStore } from "./repositories/cards/cardRepository.js";
import { LoginGuardService } from "./services/auth/LoginGuardService.js";
import { LoginMetricsService } from "./services/auth/LoginMetricsService.js";
import { LoginService } from "./services/auth/LoginService.js";
import { SignupGuardService } from "./services/auth/SignupGuardService.js";
import { SignupMetricsService } from "./services/auth/SignupMetricsService.js";
import { SignupService } from "./services/auth/SignupService.js";
import { CardService } from "./services/cards/CardService.js";

const app = express();
const preferredPort = Number(process.env.PORT ?? 3000);

const isPortAvailable = async (candidatePort: number): Promise<boolean> =>
  await new Promise<boolean>((resolve) => {
    const server = net.createServer();

    server.unref();
    server.once("error", () => {
      resolve(false);
    });
    server.once("listening", () => {
      server.close(() => {
        resolve(true);
      });
    });
    server.listen(candidatePort);
  });

const resolveListenPort = async (startPort: number): Promise<number> => {
  for (let candidatePort = startPort; candidatePort < startPort + 20; candidatePort += 1) {
    if (await isPortAvailable(candidatePort)) {
      return candidatePort;
    }
  }

  return startPort;
};

const bootstrap = async (): Promise<void> => {
  app.set("trust proxy", true);
  app.use(corsMiddleware);
  app.use(express.json());

  const authStore = await createPrismaAuthStore();
  const cardStore = await createPrismaCardStore();
  const signupRepository = new SignupRepository(authStore);
  const loginRepository = new LoginRepository(authStore);
  const cardRepository = new CardRepository(cardStore);
  const signupGuardService = new SignupGuardService();
  const signupMetricsService = new SignupMetricsService();
  const signupService = new SignupService(signupRepository, signupGuardService, signupMetricsService);
  const signupController = new SignupController(signupService, signupMetricsService);
  const loginGuardService = new LoginGuardService();
  const loginMetricsService = new LoginMetricsService();
  const loginService = new LoginService(loginRepository, loginGuardService, loginMetricsService);
  const loginController = new LoginController(loginService);
  const cardService = new CardService(cardRepository);
  const cardController = new CardController(cardService);

  app.use("/auth", buildSignupRoutes(signupController));
  app.use("/auth", buildLoginRoutes(loginController));
  app.use("/cards", buildCardRoutes(cardController, authStore));

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  const listenPort = await resolveListenPort(preferredPort);

  app.listen(listenPort, () => {
    console.log(`Backend server listening on port ${listenPort}`);
  });
};

void bootstrap().catch((error: unknown) => {
  console.error("Failed to start backend server", error);
  process.exitCode = 1;
});
