import { google } from "googleapis"
import { FileListResponse } from "../types/drive"
require("dotenv").config()
import path from "path"
import fs from "fs"
const os = require("os")

const stringKey = process.env.DRIVE_KEY!
const DRIVE_ID = process.env.DRIVE_ID
const key = JSON.parse(stringKey)

const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: ["https://www.googleapis.com/auth/drive"],
})

const driveService = google.drive({ version: "v3", auth })

const getFile = async (id: string) => {
  try {
    const response = await driveService.files.get({
      fields: "name, parents, webViewLink",
      fileId: id,
      supportsAllDrives: true,
    })
    return response.data
  } catch (error) {
    console.error("Error getting folder:", error)
    throw error
  }
}

const getFilesByName = async (name: string) => {
  try {
    const res = await driveService.files.list({
      corpora: "drive",
      driveId: DRIVE_ID,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      q: `trashed = false and name contains '${name}' and mimeType contains 'image/png'`,
    })

    return res.data
  } catch (error) {
    throw error
  }
}

const getFilesList = async (
  parentId: string,
  name: string
): Promise<FileListResponse> => {
  try {
    const response = await driveService.files.list({
      corpora: "drive",
      driveId: DRIVE_ID,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      q: `'${parentId}' in parents and trashed = false and name = '${name}'`,
    })
    return response.data
  } catch (error: any) {
    console.error("Error getting folder:", error)
    throw error
  }
}

const getPNG = async (parentId: string, fileId: string) => {
  try {
    const response = await driveService.files.list({
      corpora: "drive",
      driveId: DRIVE_ID,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      q: `'${parentId}' in parents and trashed = false and name contains '${fileId}' and mimeType contains 'image/png'`,
    })
    return response.data
  } catch (error: any) {
    console.error("Error getting folder:", error)
    throw error
  }
}

const createFolder = async (parentId: string, name: string) => {
  try {
    const response = await driveService.files.create({
      requestBody: {
        driveId: DRIVE_ID,
        name: name,
        parents: [parentId],
        mimeType: "application/vnd.google-apps.folder",
      },
      supportsAllDrives: true,
    })
    return response.data
  } catch (error) {
    console.error("Error creating folder:", error)
    throw error
  }
}

const downloadPNG = async (id: string) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const tmpDir = os.tmpdir()
      const filePath = path.join(tmpDir, "media.png")
      const dest = fs.createWriteStream(filePath)

      driveService.files.get(
        {
          fileId: id,
          alt: "media",
        },
        {
          responseType: "stream",
        },
        (err, res) => {
          if (err) {
            reject(err)
            return
          }

          res.data
            .on("end", () => {
              console.log("File downloaded")
              resolve(filePath)
            })
            .on("error", (error) => {
              reject(error)
            })
            .pipe(dest)
        }
      )
    } catch (err) {
      reject(err)
    }
  })
}

const getDrive = async (driveID: string) => {
  try {
    const response = await driveService.drives.get({
      driveId: driveID,
      fields: "name",
    })
    return response.data
  } catch (error) {
    console.error("Error getting drive:", error)
    throw error
  }
}

const getAboutUser = async () => {
  try {
    const response = await driveService.about.get({
      fields: "user",
    })
    return response.data
  } catch (error) {
    console.error("Error getting user:", error)
    throw error
  }
}

module.exports = {
  getFile,
  getFilesList,
  getPNG,
  getFilesByName,
  downloadPNG,
  getDrive,
  createFolder,
  getAboutUser,
}
