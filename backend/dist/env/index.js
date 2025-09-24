"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["dev", "test", "production"]).default("dev"),
    PORT: zod_1.z.coerce.number().default(8081),
    DEMO_TOKEN: zod_1.z.string(),
    ORS_API_KEY: zod_1.z.string(),
});
const _env = envSchema.safeParse(process.env);
if (_env.success === false) {
    console.error("Invalid enviroment variables.", _env.error.format());
    throw new Error();
}
exports.env = _env.data;
//# sourceMappingURL=index.js.map