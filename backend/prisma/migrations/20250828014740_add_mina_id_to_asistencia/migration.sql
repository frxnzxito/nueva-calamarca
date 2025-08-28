/*
  Warnings:

  - Added the required column `minaId` to the `Asistencia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Asistencia" ADD COLUMN     "minaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Asistencia" ADD CONSTRAINT "Asistencia_minaId_fkey" FOREIGN KEY ("minaId") REFERENCES "public"."Mina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
