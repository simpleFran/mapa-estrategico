/*
  Warnings:

  - A unique constraint covering the columns `[municipioId]` on the table `CamaAviaria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[municipioId]` on the table `RochaFosfato` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CamaAviaria_municipioId_key" ON "CamaAviaria"("municipioId");

-- CreateIndex
CREATE UNIQUE INDEX "RochaFosfato_municipioId_key" ON "RochaFosfato"("municipioId");
