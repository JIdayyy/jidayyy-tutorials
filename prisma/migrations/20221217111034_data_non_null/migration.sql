/*
  Warnings:

  - Made the column `createdAt` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Tag` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Tag` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Technology` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Technology` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Technology" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
