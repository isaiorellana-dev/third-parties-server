"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getFilesList, getFile, createFolder } = require("../handlers/drive");
const { editDriveLink } = require("../handlers/notion");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const PARENT_FOLDER = process.env.PARENT_FOLDER;
router.get("/page", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = req.query;
    const path = {
        year: { value: "", id: "", parentId: PARENT_FOLDER },
        store: { value: "", id: "", parentId: "" },
        month: { value: "", id: "", parentId: "" },
        dateRange: { value: "", id: "", parentId: "" },
        designer: { value: "", id: "", parentId: "" },
    };
    const pathKeys = Object.keys(path);
    for (const [index, key] of pathKeys.entries()) {
        const keyWithQuery = key;
        console.info("KEY:", keyWithQuery);
        try {
            // Search folder
            console.info("Searching folder...");
            const data = yield getFilesList(path[key].parentId, query[keyWithQuery].replace(/_/g, " "));
            if (data.files != undefined) {
                if (((_a = data.files) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    console.info("Folder encontrado con id:", data.files[0].id);
                    // Asignar Id de folder encontrado
                    path[key].id = data.files[0].id;
                    path[key].value = data.files[0].name;
                    // Asignar parent id al siguiente elemento de path
                    const nextKey = Object.keys(path)[index + 1];
                    if (nextKey != undefined) {
                        path[nextKey].parentId = path[key].id;
                    }
                    else {
                        console.info("Creando folder de tablets");
                        yield createFolder(data.files[0].id, "Tablets");
                    }
                }
                else {
                    console.info("Folder no encontrado");
                    try {
                        console.info("Creando folder:", query[keyWithQuery].replace(/_/g, " "));
                        const folderResponse = yield createFolder(path[key].parentId, query[keyWithQuery].replace(/_/g, " "));
                        path[key].id = folderResponse.id;
                        path[key].value = query[keyWithQuery].replace(/_/g, " ");
                        // next
                        const nextKey = Object.keys(path)[index + 1];
                        if (nextKey != undefined) {
                            path[nextKey].parentId = folderResponse.id;
                        }
                        else {
                            console.info("Creando folder de tablets");
                            yield createFolder(path[key].id, "Tablets");
                        }
                    }
                    catch (error) {
                        console.info(error);
                    }
                }
            }
        }
        catch (error) {
            console.info("Hubo un error en:", keyWithQuery);
            console.info(error);
            console.info("-".repeat(50));
        }
        console.info("-".repeat(40));
    }
    // Set viewLink
    try {
        const designerFolder = yield getFile(path.designer.id);
        yield editDriveLink(query.id, designerFolder.webViewLink);
    }
    catch (error) {
        console.warn("Hubo un error al obtener el link de la carpeta.");
        console.error(error);
    }
    res.send("Accepted");
}));
module.exports = router;
//# sourceMappingURL=notionWebhooks.js.map