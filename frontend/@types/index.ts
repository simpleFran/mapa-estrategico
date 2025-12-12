export type MapPoint = {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  type: "cama" | "rocha";
};

export type Cidade = {
  codigo_ibge: number;
  nome: string;
  latitude: number;
  longitude: number;
};

export type Sugestao = Cidade & {
  distancia: number;
};

export type RotaSugestaoResponse = {
  origem: Cidade;
  destino: Cidade;
  sugestoes: Sugestao[];
};
