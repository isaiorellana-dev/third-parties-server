"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const rootRouter = require("./routes");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("hello world");
});
rootRouter(app);
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
//# sourceMappingURL=index.js.map