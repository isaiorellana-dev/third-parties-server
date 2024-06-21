import express from "express"
const {
  getFilesList,
  getFile,
  createFolder,
  getPNG,
  downloadPNG,
} = require("../handlers/drive")
const {
  editDriveLink,
  editDriveFile,
  getEmailData,
  setNotified,
} = require("../handlers/notion")
const { sendEmail } = require("../handlers/gmail")
import dotenv from "dotenv"
import { Path } from "../types/drive"
import path from "path"
import fs from "fs"
import { cleanEmails, encodeFileToBase64 } from "../utils/tools"
import { MakeCarpetQuery, GetFileQuery } from "../types/notion"

dotenv.config()

const router = express.Router()

const PARENT_FOLDER = process.env.PARENT_FOLDER

router.get("/page", async (req, res) => {
  const query: MakeCarpetQuery = req.query as MakeCarpetQuery
  const path: Path = {
    year: { value: "", id: "", parentId: PARENT_FOLDER! },
    store: { value: "", id: "", parentId: "" },
    month: { value: "", id: "", parentId: "" },
    dateRange: { value: "", id: "", parentId: "" },
    designer: { value: "", id: "", parentId: "" },
  }

  const pathKeys = Object.keys(path) as Array<keyof Path>

  for (const [index, key] of pathKeys.entries()) {
    const keyWithQuery = key as keyof MakeCarpetQuery

    console.info("KEY:", keyWithQuery)

    try {
      // Search folder
      console.info("Searching folder...")
      const data = await getFilesList(
        path[key].parentId,
        query[keyWithQuery].replace(/_/g, " ")
      )
      if (data.files != undefined) {
        if (data.files?.length > 0) {
          console.info("Folder encontrado con id:", data.files[0].id)
          // Asignar Id de folder encontrado
          path[key].id = data.files[0].id
          path[key].value = data.files[0].name
          // Asignar parent id al siguiente elemento de path
          const nextKey = Object.keys(path)[index + 1] as keyof Path

          if (nextKey != undefined) {
            path[nextKey].parentId = path[key].id
          } else {
            console.info("Creando folder de tablets")
            await createFolder(data.files[0].id, "Tablets")
          }
        } else {
          console.info("Folder no encontrado")
          try {
            console.info(
              "Creando folder:",
              query[keyWithQuery].replace(/_/g, " ")
            )
            const folderResponse = await createFolder(
              path[key].parentId,
              query[keyWithQuery].replace(/_/g, " ")
            )

            path[key].id = folderResponse.id
            path[key].value = query[keyWithQuery].replace(/_/g, " ")
            // next
            const nextKey = Object.keys(path)[index + 1] as keyof Path

            if (nextKey != undefined) {
              path[nextKey].parentId = folderResponse.id
            } else {
              console.info("Creando folder de tablets")

              await createFolder(path[key].id, "Tablets")
            }
          } catch (error) {
            console.info(error)
          }
        }
      }
    } catch (error) {
      console.info("Hubo un error en:", keyWithQuery)
      console.info(error)
      console.info("-".repeat(50))
    }
    console.info("-".repeat(40))
  }

  // Set viewLink
  try {
    const designerFolder = await getFile(path.designer.id)
    await editDriveLink(query.id, designerFolder.webViewLink, path.designer.id)
  } catch (error) {
    console.warn("Hubo un error al obtener el link de la carpeta.")
    console.error(error)
  }

  res.send("Accepted")
})

router.get("/file", async (req, res) => {
  const query: GetFileQuery = req.query as GetFileQuery
  console.log(query)

  let id

  try {
    const folder = await getPNG(query.drive_id)
    id = folder.files[0].id
    console.log("id:", id)
    console.log(folder)
    let webLink = `https://drive.google.com/file/d/${id}/view?usp=drive_link`
    console.log(webLink)
    await editDriveFile(query.id, webLink)
  } catch (error) {
    console.log(error)
  }
  res.send("accepted")
})

router.get("/page-data", async (req, res) => {
  const pageId = req.query.id
  try {
    const emailData = await getEmailData(pageId)
    res.json(emailData)
  } catch (error) {
    throw new Error(error)
  }
})

router.get("/email", async (req, res) => {
  // get page data (Folder id, email, user, password)
  const pageId = req.query.id

  console.log(pageId)

  try {
    const emailData = await getEmailData(pageId)
    const CC = process.env.CC

    const parentId = emailData.folderUrl.split("/")

    const getImage = await getPNG(parentId[parentId.length - 1], emailData.id)

    console.log(emailData.folderUrl, emailData.id)
    console.log(getImage)

    if (getImage.files[0] && getImage.files.length > 0) {
      const filePath = await downloadPNG(getImage.files[0].id)

      const emails = cleanEmails(emailData.email)
      emails.push(CC)

      const imageBase64 = await encodeFileToBase64(filePath)
      await sendEmail(emailData.user, emailData.token, imageBase64, emails)

      await setNotified(pageId)

      res.send("Completed")
    } else {
      res.send("No se encontro el archivo")
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  } finally {
    const filePath = path.join("src", "assets/img/media.png")

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("Img does not exist")
      } else {
        console.log("Img exists")
        fs.unlink(filePath, (err: any) => {
          if (err) {
            console.error("Error deleting img", err)
          } else {
            console.log("Image deleted successfully")
          }
        })
      }
    })
  }
})

module.exports = router
