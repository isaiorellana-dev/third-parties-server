import express, { Application } from "express"

const tfRouter = require("./tollfreeTool")
const fRouter = require("./finder")
const notionRouter = require("./notionWebhooks")

const rootRouter = (app: Application) => {
  const router = express.Router()

  app.use(router)

  router.use("/th", tfRouter)

  router.use("/n", notionRouter)

  router.use("/f", fRouter)
}

module.exports = rootRouter
