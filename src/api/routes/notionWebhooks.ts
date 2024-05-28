import express from "express"
const { getFilesList, getFile, createFolder } = require("../handlers/drive")
const { editDriveLink } = require("../handlers/notion")
import dotenv from "dotenv"
import { Path } from "../types/drive"
import { MakeCarpetQuery } from "../types/notion"

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

    console.log("KEY:", keyWithQuery)

    try {
      // Search folder
      console.log("Searching folder...")
      const data = await getFilesList(
        path[key].parentId,
        query[keyWithQuery].replace(/_/g, " ")
      )
      if (data.files != undefined) {
        if (data.files?.length > 0) {
          console.log("Folder encontrado con id:", data.files[0].id)
          // Asignar Id de folder encontrado
          path[key].id = data.files[0].id
          path[key].value = data.files[0].name
          // Asignar parent id al siguiente elemento de path
          const nextKey = Object.keys(path)[index + 1] as keyof Path

          if (nextKey != undefined) {
            path[nextKey].parentId = path[key].id
          } else {
            console.log("Creando folder de tablets")
            await createFolder(data.files[0].id, "Tablets")
          }
        } else {
          console.log("Folder no encontrado")
          try {
            console.log(
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
              console.log("Creando folder de tablets")

              await createFolder(path[key].id, "Tablets")
            }
          } catch (error) {
            console.log(error)
          }
        }
      }
    } catch (error) {
      console.log("Hubo un error en:", keyWithQuery)
      console.log(error)
      console.log("-".repeat(50))
    }
    console.log("-".repeat(40))
  }

  // Set viewLink
  try {
    const designerFolder = await getFile(path.designer.id)
    await editDriveLink(query.id, designerFolder.webViewLink)
  } catch (error) {
    console.log("no se pudo setear la vaina")
    console.log(error)
  }

  res.send("Accepted")
})

module.exports = router
