import express, { Request, Response } from "express";
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
import { makeCreateBillingController } from "../factories/billing/makeCreateBillingController";
import { CreatePaymentUseCase } from "../application/useCases/payment/CreatePaymentUseCase";
import { prismaClient } from "../application/libs/prismaClient";
import { Server } from "socket.io";
import http from "http";

const app = express();
app.use(express.json());
app.use(cors());
const router = express.Router();

const server = http.createServer(app); // Usa o mesmo servidor HTTP
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
  console.log("🟢 Cliente conectado:", socket.id);
  socket.on("notification", (data) => {
    console.log("📩 Notificação recebida:", data);
    io.emit("notification", data); // Reenvia para todos os clientes conectados
  });
});

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

router.post(
  "/billing",
  middlewareAdapter(makeAuthenticationMiddleware()),
  routeAdapter(makeCreateBillingController())
);

app.use("/api", router);

app.post("/api/webhook/abacatepay", async (req: Request, res: Response) => {
  const { data } = req.body;
  console.log("Webhook recebido:", data);

  const { customer, amount, status, products } = data.billing;
  const paymentUseCase = new CreatePaymentUseCase();

  const amountInCents = parseInt(amount);
  const value = amountInCents / 100;

  paymentUseCase.execute({
    email: customer.metadata.email,
    paymentDate: new Date(),
    subscriptionId: products[0].externalId,
    value,
  });

  await prismaClient.gymClient.update({
    where: {
      email: customer.metadata.email,
    },
    data: {
      subscriptionLastPayment: new Date(),
      paymentStatus: status,
    },
  });

  io.emit("notification", {
    message: `Pagamento de ${value} aprovado para ${customer.metadata.email}`,
  });

  res.status(200).send();
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

io.listen(8080);

const CRON_JOB_TIME = "*/1 * * * *";

cron.schedule(CRON_JOB_TIME, () => {
  console.log("Rodando verificação de pagamentos...");
  checkPayments();
});
