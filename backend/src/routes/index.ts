import { Router } from "express";
import { CamaAviariaController } from "../controller/camaAviariaController";
import { EmpresasFertilizanteController } from "../controller/empresasFertilizanteController";
import { RochaFosfatoController } from "../controller/rochaFosfatoController";
import { sugerirRotasUT,sugerirRotasORS } from "../controller/rotaSugestaoControllerUT";
import { authToken } from "../middleware/authToken";
import { sugerirRotasORS_MOCK } from "../controller/sugerirRotasORS_MOCK";

const router = Router();

// Substitua a rota real por essa temporariamente
router.get("/mock/rotas", sugerirRotasORS_MOCK);


// router.get("/sugerir-rodovia", sugerirRotasOSRM);
router.get("/rota-sugestao", authToken, sugerirRotasUT);
// console.log("Tipo de sugerirRotasORS:", typeof sugerirRotasORS);
router.get("/sugestao-ors", sugerirRotasORS);
router.get("/cama-aviaria", CamaAviariaController.getCidades);
router.get("/rocha-fosfato", RochaFosfatoController.getCidades);
router.get("/empresas-fertilizantes", EmpresasFertilizanteController.getCidades);

export default router;
