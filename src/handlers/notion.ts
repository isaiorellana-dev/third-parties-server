const { Client } = require("@notionhq/client")
require("dotenv").config()

const notion = new Client({ auth: process.env.NOTION_KEY })

const editDriveLink = async (id: string, url: string, folderId: string) => {
  try {
    const res = await notion.pages.update({
      page_id: id,
      properties: {
        "Drive URL": url,
        "drive id": folderId,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error
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
  getDatabase,
}
