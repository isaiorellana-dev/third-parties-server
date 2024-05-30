import express, { Application } from "express"

const tfRouter = require("./tollfreeTool")
const notionRouter = require("./notionWebhooks")

const rootRouter = (app: Application) => {
  const router = express.Router()

  app.use(router)

  router.use("/th", tfRouter)

  router.use("/n", notionRouter)
}

module.exports = rootRouter
