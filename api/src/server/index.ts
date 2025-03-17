import express from "express";
import cron from "node-cron";

import { routeAdapter } from "./adapters/routeAdapter";
import { makeAuthenticationMiddleware } from "../factories/makeAuthenticationMiddleware";
import { middlewareAdapter } from "./adapters/middlewareAdapter";
import { makeCreateSubscriptionController } from "../factories/subscription/makeCreateSubscriptionController";
import { makeGetMetricsController } from "../factories/makeGetMetricsController";
import { checkPayments } from "../jobs/check-payments";
import { makeGetSubscriptionsController } from "../factories/subscription/makeGetSubscriptionsController";
import { makeDeleteSubscriptionController } from "../factories/subscription/makeDeleteSubscriptionController";
import { makeUpdateSubscriptionController } from "../factories/subscription/makeUpdateSubscriptionController";
import { makeSignUpController } from "../factories/auth/makwSignUpController";
import { makeSignInController } from "../factories/auth/makeSignInController";
import { makeCreateGymClientController } from "../factories/gym-client/makeCreateGymClientController";
import { makeUpdateGymClientController } from "../factories/gym-client/makeUpdateGymClientController";
import { makeGetAllGymClientsController } from "../factories/gym-client/makeGetAllGymClientsController";
import cors from "cors";
import { makeGetLastSixMonthsPaymentController } from "../factories/payment/makeGetLastSixPaymentsController";
import { makeGetPaymentController } from "../factories/payment/makeGetPaymentsController";

const app = express();
app.use(express.json());
app.use(cors());
const router = express.Router();

router.post("/sign-up", routeAdapter(makeSignUpController()));
router.post("/sign-in", routeAdapter(makeSignInController()));

router.post(
  "/gym-clients/:userId",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeCreateGymClientController())
);
router.put(
  "/gym-clients/:clientId",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeUpdateGymClientController())
);

router.get(
  "/gym-clients/:userId",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetAllGymClientsController())
);

router.post(
  "/subscription/:userId",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeCreateSubscriptionController())
);

router.get(
  "/subscription/:userId",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetSubscriptionsController())
);

router.put(
  "/subscription/:subscriptionId",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeUpdateSubscriptionController())
);

router.delete(
  "/subscription/:subscriptionId",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeDeleteSubscriptionController())
);

router.get(
  "/metrics/:userId",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetMetricsController())
);

router.get(
  "/payments/graph/:userId",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetLastSixMonthsPaymentController())
);

router.get(
  "/payments/:userId",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeGetPaymentController())
);

app.use("/api", router);

app.listen(3000, () => {
  console.log("🚀 Servidor rodando na porta 3000");
});

const CRON_JOB_TIME = "*/1 * * * *";

cron.schedule(CRON_JOB_TIME, () => {
  console.log("Rodando verificação de pagamentos...");
  checkPayments();
});
