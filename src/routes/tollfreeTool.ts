import express from "express"
import dotenv from "dotenv"
const { getDatabase } = require("../handlers/notion")

dotenv.config()

const router = express.Router()

router.post("/tollfree-info", async (req, res) => {
  const properties = [
    "title",
    "J%60EY",
    "gcGS",
    "cGjB",
    "~qCZ",
    "O%5EfE",
    "kG%3Du",
    "kI%5C%3E",
    "ic%7DS",
    "V~%7BJ",
  ]
  const DB_ID = process.env.STORES_DB_ID
  const start_cursor = req.body.start_cursor
  try {
    const response = await getDatabase(DB_ID, properties, start_cursor)
    res.json(response)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error en la solicitud a Notion")
  }
})

module.exports = router
