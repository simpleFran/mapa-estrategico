// Importa os dados de data.json para o BD PostgreSQL
import { PrismaClient } from "@prisma/client";
import _data from "./data.json";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Iniciando importação de dados...");

    // Primeiro limpa tudo se quiser garantir estado zerado (opcional)
    // await prisma.empresaFertilizante.deleteMany()
    // await prisma.rochaFosfato.deleteMany()
    // await prisma.camaAviaria.deleteMany()
    // await prisma.municipio.deleteMany()
    // await prisma.estado.deleteMany()

    // await prisma.estado.updateMany({
    //   where: {codigo_uf: -1}, // condição impossível
    //   data: {_data.Estado[0].codigo_uf},
    //   skipDuplicates: true,
    // });

    await prisma.estado.createMany({
      data: _data.Estado,
      skipDuplicates: true, 
    });

    await prisma.municipio.createMany({
      data: _data.Municipio,
      skipDuplicates: true,
    });

    await prisma.camaAviaria.createMany({
      data: _data.CamaAviaria,
      skipDuplicates: true,
    });

    await prisma.rochaFosfato.createMany({
      data: _data.RochaFosfato,
      skipDuplicates: true,
    });

    await prisma.empresaFertilizante.createMany({
      data: _data.EmpresaFertilizante,
      skipDuplicates: true,
    });

    console.log("Dados importados com sucesso!");
  } catch (error) {
    console.error("Erro ao importar dados: ", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
