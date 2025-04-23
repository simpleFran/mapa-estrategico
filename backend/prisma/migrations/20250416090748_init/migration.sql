-- CreateTable
CREATE TABLE "Estado" (
    "codigo_uf" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "regiao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Municipio" (
    "codigo_ibge" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "capital" BOOLEAN NOT NULL,
    "codigo_uf" INTEGER NOT NULL,
    CONSTRAINT "Municipio_codigo_uf_fkey" FOREIGN KEY ("codigo_uf") REFERENCES "Estado" ("codigo_uf") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CamaAviaria" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "municipioId" INTEGER NOT NULL,
    CONSTRAINT "CamaAviaria_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("codigo_ibge") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RochaFosfato" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "municipioId" INTEGER NOT NULL,
    CONSTRAINT "RochaFosfato_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("codigo_ibge") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmpresaFertilizante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "municipioId" INTEGER NOT NULL,
    CONSTRAINT "EmpresaFertilizante_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("codigo_ibge") ON DELETE RESTRICT ON UPDATE CASCADE
);
