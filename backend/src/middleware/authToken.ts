import { Request, Response, NextFunction } from "express";
import { env } from "../env";

// Token de demonstração 
const DEMO_TOKEN = env.DEMO_TOKEN;;


export function authToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${DEMO_TOKEN}`) {
      res
      .status(403)
      .json({ error: "Acesso negado. Token inválido ou ausente." });

      return;
  }

  next();
}
