import { JWT, OAuth2Client } from "google-auth-library"
import { JSONClient } from "google-auth-library/build/src/auth/googleauth"
import { google } from "googleapis"
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const stringKey = process.env.DRIVE_KEY!
const key = JSON.parse(stringKey)

// const auth = new google.auth.GoogleAuth({
//   credentials: key,
//   scopes: ["https://www.googleapis.com/auth/gmail.send"],
// })

const auth = new JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
  subject: "customerservice@sweepstouch.com", // Correo de la cuenta desde la que se enviarán los correos
})

const sendEmail = async (
  user: string,
  password: string,
  file: string,
  emails: string[]
) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: auth })

    const CCs = emails.slice(1)
    console.log(CCs)
    // console.log("path en gmail", filePath)
    // console.log(fs.readFileSync(filePath))

    const messageParts = [
      'From: "Sweepstouch LLC" <customerservice@sweepstouch.com>',
      `To: ${emails[0]}`,
      `Cc: ${CCs.join(", ")}`,
      "Subject: Test",
      "MIME-Version: 1.0",
      'Content-Type: multipart/related; boundary="boundary"',
      "",
      "--boundary",
      'Content-Type: text/html; charset="UTF-8"',
      "",
      `<img src="cid:imagen1" style="width:100%"/><h1 style="color:#fc0680; font-family: Verdana, Geneva, Tahoma, sans-serif">ADV DE LA SEMANA</h1><div style="width: 100%;"><div style="width:fit-content; margin: 0 auto"><img src="cid:flyer" style="max-width: 500px" /></div></div><div style="margin-top:30px; font-family: Arial, Helvetica, sans-serif"><p>Para mas detalles de tu campaña, ingresa y dale click <a href="https://portal.sweepstouch.com/" style="color:#fc0680;">aquí.</a></p><p style="color:#fc0680; font-weight: bold">Estas son tus credenciales:</p><ul><li>User: ${user}</li><li>Password: ${password}</li></ul></div>`,
      "",
      "--boundary",
      "Content-Type: image/png",
      "Content-Transfer-Encoding: base64",
      "Content-ID: <imagen1>",
      "",
      fs
        .readFileSync(path.join("src", "assets/img/banner.png"))
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
    ]

    const email = messageParts.join("\r\n").trim()

    const rawMessage = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
      },
    })

    return res.data
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  sendEmail,
}
