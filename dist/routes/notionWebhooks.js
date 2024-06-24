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
const { getFilesList, getFile, createFolder, getPNG, downloadPNG, } = require("../handlers/drive");
const { editDriveLink, editDriveFile, getEmailData, setNotified, } = require("../handlers/notion");
const { sendEmail } = require("../handlers/gmail");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os = require("os");
const tools_1 = require("../utils/tools");
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
        yield editDriveLink(query.id, designerFolder.webViewLink, path.designer.id);
    }
    catch (error) {
        console.warn("Hubo un error al obtener el link de la carpeta.");
        console.error(error);
    }
    res.send("Accepted");
}));
router.get("/file", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    console.log(query);
    let id;
    try {
        const folder = yield getPNG(query.drive_id);
        id = folder.files[0].id;
        console.log("id:", id);
        console.log(folder);
        let webLink = `https://drive.google.com/file/d/${id}/view?usp=drive_link`;
        console.log(webLink);
        yield editDriveFile(query.id, webLink);
    }
    catch (error) {
        console.log(error);
    }
    res.send("accepted");
}));
router.get("/page-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageId = req.query.id;
    try {
        const emailData = yield getEmailData(pageId);
        res.json(emailData);
    }
    catch (error) {
        throw new Error(error);
    }
}));
router.get("/email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get page data (Folder id, email, user, password)
    const pageId = req.query.id;
    console.log(pageId);
    try {
        const emailData = yield getEmailData(pageId);
        const CC = process.env.CC;
        const parentId = emailData.folderUrl.split("/");
        const getImage = yield getPNG(parentId[parentId.length - 1], emailData.id);
        console.log(emailData.folderUrl, emailData.id);
        console.log(getImage);
        if (getImage.files[0] && getImage.files.length > 0) {
            const filePath = yield downloadPNG(getImage.files[0].id);
            const emails = (0, tools_1.cleanEmails)(emailData.email);
            emails.push(CC);
            const imageBase64 = yield (0, tools_1.encodeFileToBase64)(filePath);
            yield sendEmail(emailData.user, emailData.token, imageBase64, emails);
            yield setNotified(pageId);
            res.send("Completed");
        }
        else {
            res.send("No se encontro el archivo");
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
    finally {
        // const filePath = path.join("src", "assets/img/media.png")
        const tmpDir = os.tmpdir();
        const filePath = path_1.default.join(tmpDir, "media.png");
        fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
            if (err) {
                console.error("Img does not exist");
            }
            else {
                console.log("Img exists");
                fs_1.default.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting img", err);
                    }
                    else {
                        console.log("Image deleted successfully");
                    }
                });
            }
        });
    }
}));
module.exports = router;
//# sourceMappingURL=notionWebhooks.js.map