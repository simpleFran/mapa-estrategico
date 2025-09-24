"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const camaAviariaController_1 = require("../controller/camaAviariaController");
const empresasFertilizanteController_1 = require("../controller/empresasFertilizanteController");
const rochaFosfatoController_1 = require("../controller/rochaFosfatoController");
const rotaSugestaoControllerUT_1 = require("../controller/rotaSugestaoControllerUT");
const authToken_1 = require("../middleware/authToken");
const sugerirRotasORS_MOCK_1 = require("../controller/sugerirRotasORS_MOCK");
const router = (0, express_1.Router)();
router.get("/mock/rotas", sugerirRotasORS_MOCK_1.sugerirRotasORS_MOCK);
router.get("/rota-sugestao", authToken_1.authToken, rotaSugestaoControllerUT_1.sugerirRotasUT);
router.get("/sugestao-ors", rotaSugestaoControllerUT_1.sugerirRotasORS);
router.get("/cama-aviaria", camaAviariaController_1.CamaAviariaController.getCidades);
router.get("/rocha-fosfato", rochaFosfatoController_1.RochaFosfatoController.getCidades);
router.get("/empresas-fertilizantes", empresasFertilizanteController_1.EmpresasFertilizanteController.getCidades);
exports.default = router;
//# sourceMappingURL=index.js.map