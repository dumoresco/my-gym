/*
  Warnings:

  - Added the required column `taxId` to the `gym_clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gym_clients" ADD COLUMN     "taxId" TEXT NOT NULL;
