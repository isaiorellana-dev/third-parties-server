import { JWT, OAuth2Client } from "google-auth-library"
import { JSONClient } from "google-auth-library/build/src/auth/googleauth"
import { google } from "googleapis"
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const stringKey = process.env.DRIVE_KEY!
const FROM = process.env.FROM
const key = JSON.parse(stringKey)

const auth = new JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
  subject: FROM,
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

    const messageParts = [
      `From: "Sweepstouch LLC" <${FROM}>`,
      `To: ${emails[0]}`,
      `Cc: ${CCs.join(", ")}`,
      "Subject: Successful messaging campaign",
      "MIME-Version: 1.0",
      'Content-Type: multipart/related; boundary="boundary"',
      "",
      "--boundary",
      'Content-Type: text/html; charset="UTF-8"',
      "",
      `<div style="width: 100%">
        <div style="width: fit-content; max-width: 600px; margin: 0 auto">
          <p>Le informamos que su campaña de mensajes ha sido enviada con éxito.</p>
          <h1
            style="color: #fc0680; font-family: Verdana, Geneva, Tahoma, sans-serif"
          >
            ADV DE LA SEMANA
          </h1>
          <div style="width: 100%">
            <div style="width: fit-content; margin: 0 auto">
              <img src="cid:flyer" style="max-width: 500px" />
            </div>
          </div>
          <div style="margin-top: 30px; font-family: Arial, Helvetica, sans-serif">
            <p>
              Para más detalles de la campaña, haga click
              <a href="https://portal.sweepstouch.com/" style="color: #fc0680"
                >aquí.
              </a>
              Su user es ${user} y su password ${password}
            </p>
          </div>
          <img src="cid:imagen1" style="width: 100%" />
        </div>
      </div>
      `,
      "",
      "--boundary",
      "Content-Type: image/png",
      "Content-Transfer-Encoding: base64",
      "Content-ID: <imagen1>",
      "",
      fs
        .readFileSync(path.join(__dirname, "../assets/img/banner.png"))
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
