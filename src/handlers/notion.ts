const { Client } = require("@notionhq/client")
require("dotenv").config()

const notion = new Client({ auth: process.env.NOTION_KEY })

const editDriveLink = async (id: string, url: string) => {
  try {
    const res = await notion.pages.update({
      page_id: id,
      properties: {
        "Drive URL": url,
      },
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  editDriveLink,
}
