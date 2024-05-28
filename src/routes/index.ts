import express, { Application } from "express"

const notionRouter = require("./notionWebhooks.ts")

const rootRouter = (app: Application) => {
  const router = express.Router()

  app.use(router)

  router.use("/n", notionRouter)
}

module.exports = rootRouter
