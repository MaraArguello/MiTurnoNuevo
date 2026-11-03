
import { useState } from "react";
import "./Acceso.css";

function Acceso({ alIngresar, volver }) {
  const [modo, setModo] = useState("login");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [codigoRecuperacion, setCodigoRecuperacion] = useState("");

  async function manejarEnvio(e) {
    e.preventDefault();

    if (cargando) return;

    setMensaje("");
    setError("");
    setCargando(true);

    const datos = new FormData(e.currentTarget);

    try {
      // RECUPERAR CONTRASEÑA
      if (modo === "recuperar") {
        const datosRecuperacion = {
          email: datos.get("email"),
          codigo: datos.get("codigo"),
          nuevaPassword: datos.get("nuevaPassword"),
        };

        const respuesta = await fetch(
          "http://localhost:3001/api/auth/recuperar-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datosRecuperacion),
          }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
          setError(resultado.error || "No se pudo recuperar la contraseña.");
          return;
        }

        setMensaje("¡Contraseña actualizada! Ya podés iniciar sesión.");
        setModo("login");
        e.target.reset();
        return;
      }

      // REGISTRO O INICIO DE SESIÓN
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
        setCodigoRecuperacion(resultado.codigoRecuperacion);
        setMensaje("¡Cuenta creada correctamente! Guardá tu código de recuperación.");
        setModo("login");
        e.target.reset();
      } else {
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

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(codigoRecuperacion);
      setMensaje("¡Código copiado! Guardalo en un lugar seguro.");
    } catch (error) {
      setError("No se pudo copiar. Copiá el código manualmente.");
    }
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
          {modo === "login"
            ? "Bienvenido"
            : modo === "registro"
              ? "Crea una cuenta"
              : "Recuperar contraseña"}
        </h2>

        <p className="texto-acceso">
          {modo === "login"
            ? "Ingrese a su cuenta"
            : modo === "registro"
              ? "Complete sus datos"
              : "Ingresá tus datos para crear una nueva contraseña"}
        </p>

        {modo !== "recuperar" && (
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
        )}

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

          {modo === "recuperar" ? (
            <>
              <label className="campo-acceso">
                <span>🔑</span>
                <input
                  type="text"
                  name="codigo"
                  placeholder="Código de recuperación"
                  required
                />
              </label>

              <label className="campo-acceso">
                <span>🔒</span>
                <input
                  type="password"
                  name="nuevaPassword"
                  placeholder="Nueva contraseña"
                  minLength={6}
                  required
                />
              </label>
            </>
          ) : (
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
          )}

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
                : modo === "registro"
                  ? "Registrarse"
                  : "Cambiar contraseña"}
          </button>
        </form>

        {modo === "login" && (
          <button
            type="button"
            className="volver-acceso"
            onClick={() => cambiarModo("recuperar")}
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {codigoRecuperacion && (
          <div style={{ marginTop: "15px" }}>
            <p><strong>Tu código de recuperación:</strong></p>

            <p
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                letterSpacing: "2px",
                userSelect: "all",
              }}
            >
              {codigoRecuperacion}
            </p>

            <button
              type="button"
              className="boton boton-acceso"
              onClick={copiarCodigo}
            >
              Copiar código
            </button>

            <p style={{ fontSize: "13px" }}>
              Guardalo en un lugar seguro. No podrás volver a verlo.
            </p>
          </div>
        )}

        {modo === "recuperar" && (
          <button
            className="volver-acceso"
            type="button"
            onClick={() => cambiarModo("login")}
          >
            Volver al inicio de sesión
          </button>
        )}

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
