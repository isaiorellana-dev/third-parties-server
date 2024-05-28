import express from "express"

const rootRouter = require("./routes")

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get("/", (req, res) => {
  res.send("hello world")
})

rootRouter(app)

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`)
})
