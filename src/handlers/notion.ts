const { Client } = require("@notionhq/client")
require("dotenv").config()

const notion = new Client({ auth: process.env.NOTION_KEY })

const editDriveLink = async (id: string, url: string, folderId: string) => {
  try {
    const res = await notion.pages.update({
      page_id: id,
      properties: {
        "Drive Folder URL": url,
        "drive id": folderId,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getEmailData = async (id: string) => {
  const props = ["P%3Dqe", "O%3Dg%7B", "o%7CQR", "Y%5BhB", "q%40Rj", "pyCN"]
  try {
    const res = await notion.pages.retrieve({
      page_id: id,
      filter_properties: props,
    })
    const emailData = {
      email: res.properties["Email copy"].formula.string,
      user: res.properties["User"].formula.string,
      token: res.properties["Token"].formula.string,
      folderUrl: res.properties["Drive Folder URL"].url,
      name: res.properties["Name supermercado"].formula.string,
      id: res.properties["id"].formula.string,
    }

    return emailData
  } catch (error) {
    throw new Error("Message: " + error)
  }
}

const editDriveFile = async (id: string, url: string) => {
  try {
    const res = await notion.pages.update({
      page_id: id,
      properties: {
        "Google Drive File": url,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const setNotified = async (id: string) => {
  try {
    const res = await notion.pages.update({
      page_id: id,
      properties: {
        Notified: true,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getDatabase = async (
  dbId: string,
  props: string[],
  start_cursor: string
) => {
  try {
    const response = await notion.databases.query({
      database_id: dbId,
      filter_properties: props,
      start_cursor: start_cursor,
    })
    return response
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

module.exports = {
  editDriveLink,
  editDriveFile,
  setNotified,
  getDatabase,
  getEmailData,
}
