var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Client } = require("@notionhq/client");
require("dotenv").config();
const notion = new Client({ auth: process.env.NOTION_KEY });
const editDriveLink = (id, url, folderId) => __awaiter(this, void 0, void 0, function* () {
    try {
        const res = yield notion.pages.update({
            page_id: id,
            properties: {
                "Drive URL": url,
                "drive id": folderId,
            },
        });
        return res.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const editDriveFile = (id, url) => __awaiter(this, void 0, void 0, function* () {
    try {
        const res = yield notion.pages.update({
            page_id: id,
            properties: {
                "Google Drive File": url,
            },
        });
        return res.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const getDatabase = (dbId, props, start_cursor) => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield notion.databases.query({
            database_id: dbId,
            filter_properties: props,
            start_cursor: start_cursor,
        });
        return response;
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
});
module.exports = {
    editDriveLink,
    editDriveFile,
    getDatabase,
};
//# sourceMappingURL=notion.js.map