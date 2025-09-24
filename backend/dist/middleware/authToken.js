"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = authToken;
const env_1 = require("../env");
const DEMO_TOKEN = env_1.env.DEMO_TOKEN;
;
function authToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${DEMO_TOKEN}`) {
        res
            .status(403)
            .json({ error: "Acesso negado. Token inválido ou ausente." });
        return;
    }
    next();
}
//# sourceMappingURL=authToken.js.map