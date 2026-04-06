import "dotenv/config";
import express from "express";
import { buildSignupRoutes } from "./api/auth/signupRoutes.js";
import { SignupController } from "./api/auth/signupController.js";
import { SignupRepository } from "./repositories/auth/signupRepository.js";
import { SignupGuardService } from "./services/auth/SignupGuardService.js";
import { SignupMetricsService } from "./services/auth/SignupMetricsService.js";
import { SignupService } from "./services/auth/SignupService.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.set("trust proxy", true);
app.use(express.json());

const signupRepository = new SignupRepository();
const signupGuardService = new SignupGuardService();
const signupMetricsService = new SignupMetricsService();
const signupService = new SignupService(signupRepository, signupGuardService, signupMetricsService);
const signupController = new SignupController(signupService, signupMetricsService);

app.use("/auth", buildSignupRoutes(signupController));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
