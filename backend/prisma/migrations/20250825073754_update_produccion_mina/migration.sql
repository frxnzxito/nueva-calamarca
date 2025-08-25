/*
  Warnings:

  - You are about to drop the column `carros` on the `Produccion` table. All the data in the column will be lost.
  - You are about to drop the column `sacos` on the `Produccion` table. All the data in the column will be lost.
  - Added the required column `ayudanteId` to the `Produccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carrosSacados` to the `Produccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sacosSacados` to the `Produccion` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Mina_nombre_key";

-- AlterTable
ALTER TABLE "public"."Produccion" DROP COLUMN "carros",
DROP COLUMN "sacos",
ADD COLUMN     "ayudanteId" INTEGER NOT NULL,
ADD COLUMN     "carrosSacados" INTEGER NOT NULL,
ADD COLUMN     "sacosSacados" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "minaId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_minaId_fkey" FOREIGN KEY ("minaId") REFERENCES "public"."Mina"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Produccion" ADD CONSTRAINT "Produccion_ayudanteId_fkey" FOREIGN KEY ("ayudanteId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
