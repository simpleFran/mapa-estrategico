import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const estadosFile = path.join(__dirname, "../../data/estados.csv");
const municipiosFile = path.join(__dirname, "../../data/municipios.csv");

async function importEstados() {
  const estados: any[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(estadosFile)
       .pipe(
          csv({
            separator: ",",
            skipLines: 1,
            headers: ["codigo_uf", "uf", "nome", "latitude", "longitude", "regiao"],
          })
        )
      .on("data", (row) => {
        console.log("[estados file]Linha lida:", row); // ADICIONE ESTA LINHA
        console.log("cod uf", row.codigo_uf);
        const codigoUf = parseInt(row.codigo_uf?.trim());
        if (isNaN(codigoUf)) {
          console.warn("⚠️ código_uf inválido:", row.codigo_uf);
          return;
        }

        estados.push({
          code: codigoUf,
          name: row.nome?.trim(),
          uf: row.uf?.trim(),
          region: row.regiao?.trim(),
          latitude: parseFloat(row.latitude?.trim()),
          longitude: parseFloat(row.longitude?.trim()),
        });
      })
      .on("end", async () => {
        try {
          for (const estado of estados) {
            await prisma.estado.upsert({
              where: { codigo_uf: estado.code },
              update: {},
              create: {
                codigo_uf: estado.code,
                nome: estado.name,
                uf: estado.uf,
                regiao: estado.region,
                latitude: estado.latitude,
                longitude: estado.longitude,
              },
            });
          }
          console.log(`✅ Estados importados: ${estados.length}`);
          resolve();
        } catch (error) {
          console.error("Erro ao importar estados:", error);
          reject(error);
        }
      });
  });
}

async function importMunicipios() {
  const municipios: any[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(municipiosFile)
       .pipe(
          csv({
            separator: ",",
            skipLines: 1,
            // codigo_ibge,nome,latitude,longitude,capital,codigo_uf
            headers: ["codigo_ibge", "nome",  "latitude", "longitude", "capital", "codigo_uf"],
          })
        )
      .on("data", (row) => {
        console.log("[municipios file]Linha lida:", row); // ADICIONE ESTA LINHA
        const codigoIbge = parseInt(row.codigo_ibge?.trim());
        const codigoUf = parseInt(row.codigo_uf?.trim());

        if (isNaN(codigoIbge) || isNaN(codigoUf)) {
          console.warn("⚠️ código_ibge ou código_uf inválido:", row);
          return;
        }

        municipios.push({
          code: codigoIbge,
          name: row.nome?.trim(),
          latitude: parseFloat(row.latitude?.trim()),
          longitude: parseFloat(row.longitude?.trim()),
          isCapital: row.capital?.trim().toLowerCase() === "true",
          stateCode: codigoUf,
        });
      })
      .on("end", async () => {
        try {
          for (const cidade of municipios) {
            const estado = await prisma.estado.findUnique({
              where: { codigo_uf: cidade.stateCode },
            });

            if (estado) {
              await prisma.municipio.upsert({
                where: { codigo_ibge: cidade.code },
                update: {},
                create: {
                  codigo_ibge: cidade.code,
                  nome: cidade.name,
                  latitude: cidade.latitude,
                  longitude: cidade.longitude,
                  capital: cidade.isCapital,
                  codigo_uf: estado.codigo_uf,
                },
              });
            }
          }
          console.log(`✅ Municípios importados: ${municipios.length}`);
          resolve();
        } catch (error) {
          console.error("Erro ao importar municípios:", error);
          reject(error);
        }
      });
  });
}

async function main() {
  console.log("🚀 Iniciando importação...");
  await importEstados();
  await importMunicipios();
  await prisma.$disconnect();
  console.log("🎉 Importação concluída com sucesso!");
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
