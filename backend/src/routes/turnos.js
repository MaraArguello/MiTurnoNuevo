
const express = require("express");
const router = express.Router();
const conexion = require("../config/db");

// Obtener todos los turnos
router.get("/", (req, res) => {
  conexion.query(
    "SELECT * FROM turnos ORDER BY fecha, horario",
    (error, resultados) => {
      if (error) {
        return res.status(500).json({ error: "No se pudieron obtener los turnos" });
      }

      res.json(resultados);
    }
  );
});

// Crear un turno
router.post("/", (req, res) => {
  const { nombre, servicio, fecha, horario } = req.body;

  if (!nombre || !servicio || !fecha || !horario) {
    return res.status(400).json({ error: "Completá todos los campos" });
  }

  const sql = `
    INSERT INTO turnos (nombre, servicio, fecha, horario)
    VALUES (?, ?, ?, ?)
  `;

  conexion.query(
    sql,
    [nombre, servicio, fecha, horario],
    (error, resultado) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Ese horario ya está ocupado" });
        }

        return res.status(500).json({ error: "No se pudo guardar el turno" });
      }

      res.status(201).json({
        mensaje: "Turno guardado correctamente",
        id: resultado.insertId,
      });
    }
  );
});

module.exports = router;
