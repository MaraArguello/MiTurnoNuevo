
import { useState } from "react";
import "./Acceso.css";

function Acceso({ alIngresar, volver }) {
  const [modo, setModo] = useState("login");

  return (
    <div className="acceso">
      <div className="acceso-caja">
        <img
          src="/img/logo.png"
          alt="MiTurno"
          className="logo-imagen"
        />

        <h2>{modo === "login" ? "Bienvenido" : "Crea una cuenta"}</h2>

        <p className="texto-acceso">
          {modo === "login"
            ? "Ingrese a su cuenta"
            : "Complete sus datos"}
        </p>

        <div className="pestanas-acceso">
          <button
            type="button"
            className={modo === "login" ? "activa" : ""}
            onClick={() => setModo("login")}
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            className={modo === "registro" ? "activa" : ""}
            onClick={() => setModo("registro")}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          alIngresar();
        }}>
          {modo === "registro" && (
            <div className="campos-dobles">
              <label>
                <span>👤</span>
                <input type="text" placeholder="Nombre" required />
              </label>

              <label>
                <span>👤</span>
                <input type="text" placeholder="Apellido" required />
              </label>
            </div>
          )}

          <label className="campo-acceso">
            <span>✉</span>
            <input
              type="email"
              placeholder="Usuario o email"
              required
            />
          </label>

          <label className="campo-acceso">
            <span>🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              required
            />
          </label>

          <button className="boton boton-acceso" type="submit">
            {modo === "login" ? "Iniciar sesión" : "Registrarse"}
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
