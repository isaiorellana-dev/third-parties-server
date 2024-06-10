import express from "express"
const {
  getFilesList,
  getFile,
  createFolder,
  getPNG,
} = require("../handlers/drive")
const { editDriveLink, editDriveFile } = require("../handlers/notion")
import dotenv from "dotenv"
import { Path } from "../types/drive"
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
  let webLink = `https://drive.google.com/file/d/${id}/view?usp=drive_link`

  try {
    const folder = await getPNG(query.drive_id)
    id = folder.files[0].id
    console.log(folder)
    const n = await editDriveFile(query.id, webLink)
    console.log(n)
  } catch (error) {
    console.log(error)
  }
  res.send("accepted")
})

module.exports = router
