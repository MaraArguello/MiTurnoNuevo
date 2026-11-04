
const express = require("express");
const router = express.Router();
const conexion = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTRO
router.post("/registro", async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({
      error: "Completá todos los campos.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "La contraseña debe tener al menos 6 caracteres.",
    });
  }

  try {
    const correo = email.trim().toLowerCase();

    conexion.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [correo],
      async (error, resultados) => {
        if (error) {
          return res.status(500).json({
            error: "Error al verificar el usuario.",
          });
        }

        if (resultados.length > 0) {
          return res.status(409).json({
            error: "Ese email ya está registrado.",
          });
        }

        try {
          const passwordHash = await bcrypt.hash(password, 10);

          conexion.query(
            `INSERT INTO usuarios (nombre, apellido, email, password)
             VALUES (?, ?, ?, ?)`,
            [nombre.trim(), apellido.trim(), correo, passwordHash],
            (error, resultado) => {
              if (error) {
                return res.status(500).json({
                  error: "No se pudo crear la cuenta.",
                });
              }

              res.status(201).json({
                mensaje: "Cuenta creada correctamente.",
                id: resultado.insertId,
              });
            }
          );
        } catch (error) {
          res.status(500).json({
            error: "Error al crear la cuenta.",
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      error: "Error en el registro.",
    });
  }
});

// INICIO DE SESIÓN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Ingresá tu email y contraseña.",
    });
  }

  const correo = email.trim().toLowerCase();

  conexion.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [correo],
    async (error, resultados) => {
      if (error) {
        return res.status(500).json({
          error: "Error al buscar la cuenta.",
        });
      }

      if (resultados.length === 0) {
        return res.status(401).json({
          error: "El email o la contraseña son incorrectos.",
        });
      }

      try {
        const usuario = resultados[0];

        const coincide = await bcrypt.compare(
          password,
          usuario.password
        );

        if (!coincide) {
          return res.status(401).json({
            error: "El email o la contraseña son incorrectos.",
          });
        }

        // GENERAR TOKEN JWT
        const token = jwt.sign(
          {
            id: usuario.id,
            email: usuario.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "2h",
          }
        );

        res.json({
          mensaje: "Inicio de sesión correcto.",
          token,
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
          },
        });
      } catch (error) {
        console.error("Error al iniciar sesión:", error);

        res.status(500).json({
          error: "No se pudo iniciar sesión.",
        });
      }
    }
  );
});

module.exports = router;
