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
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const googleapis_1 = require("googleapis");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const stringKey = process.env.DRIVE_KEY;
const FROM = process.env.FROM;
const key = JSON.parse(stringKey);
const auth = new google_auth_library_1.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/gmail.send"],
    subject: FROM,
});
const sendEmail = (user, password, file, emails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gmail = googleapis_1.google.gmail({ version: "v1", auth: auth });
        const CCs = emails.slice(1);
        console.log(CCs);
        const messageParts = [
            `From: "Sweepstouch LLC" <${FROM}>`,
            `To: ${emails[0]}`,
            `Cc: ${CCs.join(", ")}`,
            "Subject: Test",
            "MIME-Version: 1.0",
            'Content-Type: multipart/related; boundary="boundary"',
            "",
            "--boundary",
            'Content-Type: text/html; charset="UTF-8"',
            "",
            `<h1 style="color:#fc0680; font-family: Verdana, Geneva, Tahoma, sans-serif">ADV DE LA SEMANA</h1><div style="width: 100%;"><div style="width:fit-content; margin: 0 auto"><img src="cid:flyer" style="max-width: 500px" /></div></div><div style="margin-top:30px; font-family: Arial, Helvetica, sans-serif"><p>Para mas detalles de tu campaña, ingresa y dale click <a href="https://portal.sweepstouch.com/" style="color:#fc0680;">aquí.</a></p><p style="color:#fc0680; font-weight: bold">Estas son tus credenciales:</p><ul><li>User: ${user}</li><li>Password: ${password}</li></ul></div><img src="cid:imagen1" style="width:100%"/>`,
            "",
            "--boundary",
            "Content-Type: image/png",
            "Content-Transfer-Encoding: base64",
            "Content-ID: <imagen1>",
            "",
            fs
                .readFileSync(path.join(__dirname, "assets/img/banner.png"))
                .toString("base64"),
            "",
            "--boundary",
            "Content-Type: image/png",
            "Content-Transfer-Encoding: base64",
            "Content-ID: <flyer>",
            "",
            file,
            "",
            "--boundary--",
        ];
        const email = messageParts.join("\r\n").trim();
        const rawMessage = Buffer.from(email)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
        const res = yield gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: rawMessage,
            },
        });
        return res.data;
    }
    catch (error) {
        console.log(error);
    }
});
module.exports = {
    sendEmail,
};
//# sourceMappingURL=gmail.js.map