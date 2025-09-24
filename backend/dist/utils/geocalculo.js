"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distanciaParaSegmento = distanciaParaSegmento;
const geolib_1 = require("geolib");
function distanciaParaSegmento(ponto, origem, destino) {
    return (0, geolib_1.getDistanceFromLine)(ponto, origem, destino);
}
//# sourceMappingURL=geocalculo.js.map