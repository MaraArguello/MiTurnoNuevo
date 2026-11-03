
const express = require("express");
const router = express.Router();
const conexion = require("../config/db");
const jwt = require("jsonwebtoken");

// VERIFICAR TOKEN
function verificarToken(req, res, next) {
  const encabezado = req.headers.authorization;

  if (!encabezado || !encabezado.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "No estás autenticado. Iniciá sesión nuevamente.",
    });
  }

  const token = encabezado.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) {
      console.error("Falta configurar JWT_SECRET en el archivo .env");

      return res.status(500).json({
        error: "Error de configuración del servidor.",
      });
    }

    req.usuario = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.usuario.id) {
      return res.status(401).json({
        error: "El token no contiene un usuario válido.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Token inválido o vencido. Iniciá sesión nuevamente.",
    });
  }
}

// OBTENER TURNOS
router.get("/", (req, res) => {
  conexion.query(
    "SELECT id, servicio, fecha, horario FROM turnos ORDER BY fecha, horario",
    (error, resultados) => {
      if (error) {
        console.error("Error al obtener turnos:", error);

        return res.status(500).json({
          error: "No se pudieron obtener los turnos.",
        });
      }

      res.json(resultados);
    }
  );
});

// CREAR TURNO (PROTEGIDO CON JWT)
router.post("/", verificarToken, (req, res) => {
  const { servicio, fecha, horario } = req.body;
  const usuario_id = req.usuario.id;

  console.log("Datos recibidos:", req.body);
  console.log("Usuario autenticado:", usuario_id);

  // VALIDAR DATOS
  if (
    typeof servicio !== "string" ||
    !servicio.trim() ||
    typeof fecha !== "string" ||
    !fecha.trim() ||
    typeof horario !== "string" ||
    !horario.trim()
  ) {
    return res.status(400).json({
      error: "Faltan datos para crear el turno.",
    });
  }

  // VERIFICAR USUARIO
  conexion.query(
    "SELECT nombre, apellido FROM usuarios WHERE id = ?",
    [usuario_id],
    (error, usuarios) => {
      if (error) {
        console.error("Error al verificar usuario:", error);

        return res.status(500).json({
          error: "No se pudo verificar el usuario.",
        });
      }

      if (usuarios.length === 0) {
        return res.status(401).json({
          error: "El usuario no existe.",
        });
      }

      const nombreCompleto =
        `${usuarios[0].nombre} ${usuarios[0].apellido}`;

      // GUARDAR TURNO
      const sql = `
        INSERT INTO turnos (nombre, servicio, fecha, horario, usuario_id)
        VALUES (?, ?, ?, ?, ?)
      `;

      conexion.query(
        sql,
        [
          nombreCompleto,
          servicio.trim(),
          fecha,
          horario,
          usuario_id,
        ],
        (error, resultado) => {
          if (error) {
            console.error("Error al guardar turno:", error);

            if (error.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                error: "Ese horario ya está ocupado.",
              });
            }

            return res.status(500).json({
              error: "No se pudo guardar el turno.",
            });
          }

          res.status(201).json({
            mensaje: "Turno guardado correctamente.",
            id: resultado.insertId,
            nombre: nombreCompleto,
            servicio: servicio.trim(),
            fecha,
            horario,
            usuario_id,
          });
        }
      );
    }
  );
});

module.exports = router;
