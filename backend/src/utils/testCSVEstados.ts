import fs from "fs";
import path from "path";
import csv from "csv-parser";

const estadosFile = path.join(__dirname, "../../data/estados.csv");

fs.createReadStream(estadosFile)
  .pipe(
    csv({
      separator: ",",
      skipLines: 1,
      headers: ["codigo_uf", "uf", "nome", "latitude", "longitude", "regiao"],
    })
  )

  .on("data", (row) => {
    console.log("🧾 Linha CSV:", row);
  })
  .on("end", () => {
    console.log("✅ Leitura finalizada com sucesso.");
  });
