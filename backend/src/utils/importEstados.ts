import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

type EstadoCSV = {
  codigo_uf: string;
  uf: string;
  nome: string;
  latitude: string;
  longitude: string;
  regiao: string;
};

async function importarEstados() {
  const filePath = path.resolve(__dirname, "estados.csv");

  const parser = fs
    .createReadStream(filePath)
    .pipe(csv({ delimiter: ",", fromLine: 2 }));

  for await (const row of parser) {
    const [codigo_uf, uf, nome, latitude, longitude, regiao] = row as string[];

    const estado: EstadoCSV = {
      codigo_uf,
      uf,
      nome,
      latitude,
      longitude,
      regiao,
    };

    console.log("🧾 Importando estado:", estado);

    await prisma.estado.create({
      data: {
        id: parseInt(estado.codigo_uf),
        sigla: estado.uf,
        nome: estado.nome,
        latitude: parseFloat(estado.latitude),
        longitude: parseFloat(estado.longitude),
        regiao: estado.regiao,
      },
    });
  }

  console.log("✅ Importação de estados finalizada com sucesso.");
}

importarEstados()
  .catch((e) => {
    console.error("❌ Erro na importação:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
