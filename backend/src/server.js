const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor de MiTurno funcionando");
});

app.use("/api/turnos", require("./routes/turnos"));
app.use("/api/auth", require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`Servidor de MiTurno iniciado en http://localhost:${PORT}`);
});