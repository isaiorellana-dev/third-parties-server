import express from "express"
const { getFilesByName } = require("../handlers/drive")

const router = express.Router()

router.get("/img", async (req, res) => {
  const name = req.query.name

  try {
    const files = await getFilesByName(name)

    res.status(200).json(files)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

module.exports = router
