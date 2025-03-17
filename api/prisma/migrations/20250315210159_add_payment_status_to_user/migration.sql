/*
  Warnings:

  - Added the required column `paymentStatus` to the `gym_clients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionLastPayment` to the `gym_clients` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'UNPAID');

-- AlterTable
ALTER TABLE "gym_clients" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL,
ADD COLUMN     "subscriptionLastPayment" TIMESTAMP(3) NOT NULL;
