"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_cron_1 = __importDefault(require("node-cron"));
const routeAdapter_1 = require("./adapters/routeAdapter");
const makeAuthenticationMiddleware_1 = require("../factories/makeAuthenticationMiddleware");
const middlewareAdapter_1 = require("./adapters/middlewareAdapter");
const makeCreateSubscriptionController_1 = require("../factories/subscription/makeCreateSubscriptionController");
const makeGetMetricsController_1 = require("../factories/makeGetMetricsController");
const check_payments_1 = require("../jobs/check-payments");
const makeGetSubscriptionsController_1 = require("../factories/subscription/makeGetSubscriptionsController");
const makeDeleteSubscriptionController_1 = require("../factories/subscription/makeDeleteSubscriptionController");
const makeUpdateSubscriptionController_1 = require("../factories/subscription/makeUpdateSubscriptionController");
const makwSignUpController_1 = require("../factories/auth/makwSignUpController");
const makeSignInController_1 = require("../factories/auth/makeSignInController");
const makeCreateGymClientController_1 = require("../factories/gym-client/makeCreateGymClientController");
const makeUpdateGymClientController_1 = require("../factories/gym-client/makeUpdateGymClientController");
const makeGetAllGymClientsController_1 = require("../factories/gym-client/makeGetAllGymClientsController");
const cors_1 = __importDefault(require("cors"));
const makeGetLastSixPaymentsController_1 = require("../factories/payment/makeGetLastSixPaymentsController");
const makeGetPaymentsController_1 = require("../factories/payment/makeGetPaymentsController");
const makeCreateBillingController_1 = require("../factories/billing/makeCreateBillingController");
const CreatePaymentUseCase_1 = require("../application/useCases/payment/CreatePaymentUseCase");
const prismaClient_1 = require("../application/libs/prismaClient");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const router = express_1.default.Router();
const server = http_1.default.createServer(app); // Usa o mesmo servidor HTTP
const io = new socket_io_1.Server(server, {
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
router.post("/sign-up", (0, routeAdapter_1.routeAdapter)((0, makwSignUpController_1.makeSignUpController)()));
router.post("/sign-in", (0, routeAdapter_1.routeAdapter)((0, makeSignInController_1.makeSignInController)()));
router.post("/gym-clients/:userId", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeCreateGymClientController_1.makeCreateGymClientController)()));
router.put("/gym-clients/:clientId", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeUpdateGymClientController_1.makeUpdateGymClientController)()));
router.get("/gym-clients/:userId", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeGetAllGymClientsController_1.makeGetAllGymClientsController)()));
router.post("/subscription/:userId", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeCreateSubscriptionController_1.makeCreateSubscriptionController)()));
router.get("/subscription/:userId", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeGetSubscriptionsController_1.makeGetSubscriptionsController)()));
router.put("/subscription/:subscriptionId", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeUpdateSubscriptionController_1.makeUpdateSubscriptionController)()));
router.delete("/subscription/:subscriptionId", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeDeleteSubscriptionController_1.makeDeleteSubscriptionController)()));
router.get("/metrics/:userId", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeGetMetricsController_1.makeGetMetricsController)()));
router.get("/payments/graph/:userId", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeGetLastSixPaymentsController_1.makeGetLastSixMonthsPaymentController)()));
router.get("/payments/:userId", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeGetPaymentsController_1.makeGetPaymentController)()));
router.post("/billing", (0, middlewareAdapter_1.middlewareAdapter)((0, makeAuthenticationMiddleware_1.makeAuthenticationMiddleware)()), (0, routeAdapter_1.routeAdapter)((0, makeCreateBillingController_1.makeCreateBillingController)()));
app.use("/api", router);
app.post("/api/webhook/abacatepay", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    console.log("Webhook recebido:", data);
    const { customer, amount, status, products } = data.billing;
    const paymentUseCase = new CreatePaymentUseCase_1.CreatePaymentUseCase();
    const amountInCents = parseInt(amount);
    const value = amountInCents / 100;
    paymentUseCase.execute({
        email: customer.metadata.email,
        paymentDate: new Date(),
        subscriptionId: products[0].externalId,
        value,
    });
    yield prismaClient_1.prismaClient.gymClient.update({
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
}));
const port = 3000;
app.listen({
    port,
}, () => {
    console.log(`Server is running on port ${port}`);
});
io.listen(3002);
const CRON_JOB_TIME = "*/1 * * * *";
node_cron_1.default.schedule(CRON_JOB_TIME, () => {
    console.log("Rodando verificação de pagamentos...");
    (0, check_payments_1.checkPayments)();
});
