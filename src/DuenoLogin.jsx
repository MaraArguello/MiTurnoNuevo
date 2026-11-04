
import "./DuenoLogin.css";

function DuenoLogin({ alVolver, alIngresar }) {

  function manejarEnvio(e) {
    e.preventDefault();

    const datos = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    alIngresar(datos);
  }

  return (
    <div className="dueno-login">

      <div className="dueno-caja">

        <img
          src="/img/logo.png"
          alt="MiTurno"
          className="dueno-logo"
        />

        <h2>Bienvenido a MiTurno</h2>

        <p className="dueno-subtitulo">
          Acceso exclusivo del dueño
        </p>

        <form onSubmit={manejarEnvio}>

          <label className="dueno-campo">
            <span>✉</span>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              required
            />
          </label>

          <label className="dueno-campo">
            <span>🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
            />
          </label>

          <button type="submit" className="dueno-boton">
            Iniciar sesión
          </button>

        </form>

        <button
          className="dueno-volver"
          onClick={alVolver}
        >
          Volver al inicio
        </button>

      </div>

    </div>
  );
}

export default DuenoLogin;
