//Exporta dados do BD atual(biofert) em PostgreSQL local para um json(data.json)

import { PrismaClient } from "@prisma/client";
// import fs from "fs/promises";
import * as fs from "fs/promises";

const prisma = new PrismaClient();

async function main() {
  try {
    // Exportar todos os dados das tabelas
    const estados = await prisma.estado.findMany();
    const municipios = await prisma.municipio.findMany();
    const camaAviaria = await prisma.camaAviaria.findMany();
    const rochaFosfato = await prisma.rochaFosfato.findMany();
    const empresasFertilizante = await prisma.empresaFertilizante.findMany();

    // Salvar os dados em um objeto JSON
    const data = {
      Estado: estados,
      Municipio: municipios,
      CamaAviaria: camaAviaria,
      RochaFosfato: rochaFosfato,
      EmpresaFertilizante: empresasFertilizante,
    };

    // // Imprimir os dados no console (para debug)
    // console.log("Dados exportados:", data);

    // Salvar os dados em formato JSON
    await fs.writeFile("prisma/data.json", JSON.stringify(data, null, 2));
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
