/*
  Warnings:

  - Made the column `default_folder` on table `Folder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "default_folder" SET NOT NULL,
ALTER COLUMN "default_folder" SET DEFAULT false;
