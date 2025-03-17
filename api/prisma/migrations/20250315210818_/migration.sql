-- AlterTable
ALTER TABLE "gym_clients" ALTER COLUMN "paymentStatus" DROP NOT NULL,
ALTER COLUMN "subscriptionLastPayment" DROP NOT NULL;
