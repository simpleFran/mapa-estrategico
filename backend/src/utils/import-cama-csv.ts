import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const camaAviariaFile = path.join(__dirname, "../../data/cama-aviaria.csv");

async function importCamaAviaria() {
  const camas: { municipioId: number }[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(camaAviariaFile)
      .pipe(csv({ separator: "," }))
      .on("data", (row) => {
        const municipioId = parseInt(String(row.municipioId).trim());


        if (isNaN(municipioId)) {
          console.warn("⚠️ municipioId inválido:", row);
          return;
        }

        camas.push({ municipioId });
      })
      .on("end", async () => {
        try {
          for (const cama of camas) {
            const municipio = await prisma.municipio.findUnique({
              where: { codigo_ibge: cama.municipioId },
            });

            if (municipio) {
              await prisma.camaAviaria.upsert({
                where: {
                  municipioId: cama.municipioId,
                },
                update: {},
                create: {
                  municipioId: cama.municipioId,
                },
              });
            } else {
              console.warn(
                "❌ Município não encontrado no banco:",
                cama.municipioId
              );
            }
          }

          console.log(`✅ Camas Aviárias importadas: ${camas.length}`);
          resolve();
        } catch (error) {
          console.error("Erro ao importar camas:", error);
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
