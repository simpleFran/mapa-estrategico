-- CreateTable
CREATE TABLE "Estado" (
    "codigo_uf" INTEGER NOT NULL,
    "uf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "regiao" TEXT NOT NULL,

    CONSTRAINT "Estado_pkey" PRIMARY KEY ("codigo_uf")
);

-- CreateTable
CREATE TABLE "Municipio" (
    "codigo_ibge" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "capital" INTEGER,
    "siafi_id" INTEGER,
    "ddd" INTEGER,
    "fuso_horario" TEXT,
    "codigo_uf" INTEGER NOT NULL,

    CONSTRAINT "Municipio_pkey" PRIMARY KEY ("codigo_ibge")
);

-- CreateTable
CREATE TABLE "CamaAviaria" (
    "id" SERIAL NOT NULL,
    "municipioId" INTEGER NOT NULL,

    CONSTRAINT "CamaAviaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RochaFosfato" (
    "id" SERIAL NOT NULL,
    "municipioId" INTEGER NOT NULL,

    CONSTRAINT "RochaFosfato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmpresaFertilizante" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "municipioId" INTEGER NOT NULL,

    CONSTRAINT "EmpresaFertilizante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CamaAviaria_municipioId_key" ON "CamaAviaria"("municipioId");

-- CreateIndex
CREATE UNIQUE INDEX "RochaFosfato_municipioId_key" ON "RochaFosfato"("municipioId");

-- AddForeignKey
ALTER TABLE "Municipio" ADD CONSTRAINT "Municipio_codigo_uf_fkey" FOREIGN KEY ("codigo_uf") REFERENCES "Estado"("codigo_uf") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CamaAviaria" ADD CONSTRAINT "CamaAviaria_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio"("codigo_ibge") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RochaFosfato" ADD CONSTRAINT "RochaFosfato_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio"("codigo_ibge") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmpresaFertilizante" ADD CONSTRAINT "EmpresaFertilizante_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio"("codigo_ibge") ON DELETE RESTRICT ON UPDATE CASCADE;
