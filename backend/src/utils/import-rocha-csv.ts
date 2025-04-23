import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rochaFile = path.join(__dirname, "../../data/rocha-fosfato.csv");

async function importCamaAviaria() {
  const rochas: { municipioId: number }[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(rochaFile)
      .pipe(csv({ separator: "," }))
      .on("data", (row) => {
        const municipioId = parseInt(String(row.municipioId).trim());


        if (isNaN(municipioId)) {
          console.warn("⚠️ municipioId inválido:", row);
          return;
        }

        rochas.push({ municipioId });
      })
      .on("end", async () => {
        try {
          for (const rocha of rochas) {
            const municipio = await prisma.municipio.findUnique({
              where: { codigo_ibge: rocha.municipioId },
            });

            if (municipio) {
              await prisma.rochaFosfato.upsert({
                where: {
                  municipioId: rocha.municipioId,
                },
                update: {},
                create: {
                  municipioId: rocha.municipioId,
                },
              });
            } else {
              console.warn(
                "❌ Município não encontrado no banco:",
                rocha.municipioId
              );
            }
          }

          console.log(`✅ Rochas de Fosfatos importadas: ${rochas.length}`);
          resolve();
        } catch (error) {
          console.error("Erro ao importar rochaas:", error);
          reject(error);
        }
      });
  });
}

async function main() {
  console.log("🚀 Iniciando importação...");
  await importCamaAviaria();
  await prisma.$disconnect();
  console.log("🎉 Importação concluída com sucesso!");
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
