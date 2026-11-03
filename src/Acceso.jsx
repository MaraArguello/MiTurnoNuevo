
import { useState } from "react";
import "./Acceso.css";

function Acceso({ alIngresar, volver }) {
  const [modo, setModo] = useState("login");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(e) {
    e.preventDefault();

    if (cargando) return;

    setMensaje("");
    setError("");
    setCargando(true);

    const datos = new FormData(e.currentTarget);

    const usuario = {
      nombre: datos.get("nombre"),
      apellido: datos.get("apellido"),
      email: datos.get("email"),
      password: datos.get("password"),
    };

    const ruta =
      modo === "registro"
        ? "/api/auth/registro"
        : "/api/auth/login";

    try {
      const respuesta = await fetch(
        `http://localhost:3001${ruta}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario),
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setError(resultado.error || "Ocurrió un error.");
        return;
      }

      if (modo === "registro") {
        setMensaje("¡Cuenta creada! Ahora podés iniciar sesión.");
        setModo("login");
        e.target.reset();
      }  else {
  localStorage.setItem("token", resultado.token);
  setMensaje("¡Bienvenido!");
  alIngresar(resultado.usuario);
}
    } catch (error) {
      console.error(error);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  function cambiarModo(nuevoModo) {
    setModo(nuevoModo);
    setMensaje("");
    setError("");
  }

  return (
    <div className="acceso">
      <div className="acceso-caja">
        <img
          src="/img/logo.png"
          alt="MiTurno"
          className="logo-imagen"
        />

        <h2>
          {modo === "login" ? "Bienvenido" : "Crea una cuenta"}
        </h2>

        <p className="texto-acceso">
          {modo === "login"
            ? "Ingrese a su cuenta"
            : "Complete sus datos"}
        </p>

        <div className="pestanas-acceso">
          <button
            type="button"
            className={modo === "login" ? "activa" : ""}
            onClick={() => cambiarModo("login")}
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            className={modo === "registro" ? "activa" : ""}
            onClick={() => cambiarModo("registro")}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={manejarEnvio}>
          {modo === "registro" && (
            <div className="campos-dobles">
              <label>
                <span>👤</span>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  required
                />
              </label>

              <label>
                <span>👤</span>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  required
                />
              </label>
            </div>
          )}

          <label className="campo-acceso">
            <span>✉</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
            />
          </label>

          <label className="campo-acceso">
            <span>🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              minLength={6}
              required
            />
          </label>

          {mensaje && (
            <p style={{ color: "#22c55e" }}>{mensaje}</p>
          )}

          {error && (
            <p style={{ color: "#ef4444" }}>{error}</p>
          )}

          <button
            className="boton boton-acceso"
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? "Espere..."
              : modo === "login"
                ? "Iniciar sesión"
                : "Registrarse"}
          </button>
        </form>

        <button
          className="volver-acceso"
          type="button"
          onClick={volver}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default Acceso;
