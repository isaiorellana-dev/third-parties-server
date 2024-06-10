import { google } from "googleapis"
import { FileListResponse } from "../types/drive"
const path = require("path")
require("dotenv").config()

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

const getPNG = async (parentId: string) => {
  try {
    const response = await driveService.files.list({
      corpora: "drive",
      driveId: DRIVE_ID,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      q: `'${parentId}' in parents and mimeType contains 'image/'`,
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
  getDrive,
  createFolder,
  getAboutUser,
}
