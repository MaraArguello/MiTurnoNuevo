
import { useState } from "react";
import "./PanelDueno.css";

function PanelDueno({ alCerrarSesion }) {
  const [seccion, setSeccion] = useState("Inicio");

  const opciones = [
    "Inicio",
    "Agenda",
    "Turnos",
    "Clientes",
    "Puntos",
    "Servicios",
    "Estadísticas",
  ];

  function mostrarContenido() {
    switch (seccion) {
      case "Inicio":
        return (
          <>
            <h1>Inicio</h1>
            <p>Bienvenido al panel de MiTurno.</p>

            <div className="resumen-tarjetas">
              <div className="resumen-card">
                <h3>Turnos de hoy</h3>
                <strong>0</strong>
              </div>

              <div className="resumen-card">
                <h3>Clientes</h3>
                <strong>0</strong>
              </div>

              <div className="resumen-card">
                <h3>Servicios</h3>
                <strong>0</strong>
              </div>

              <div className="resumen-card">
                <h3>Puntos entregados</h3>
                <strong>0</strong>
              </div>
            </div>

            <div className="panel-bloque">
              <h2>Actividad reciente</h2>
              <p>Todavía no hay actividad registrada.</p>
            </div>
          </>
        );

      case "Agenda":
        return (
          <>
            <h1>Agenda</h1>
            <p>Administrá los horarios de atención.</p>

            <div className="panel-bloque">
              <h2>Calendario de atención</h2>
              <p>Acá se mostrarán los días y horarios disponibles.</p>
            </div>
          </>
        );

      case "Turnos":
        return (
          <>
            <h1>Turnos</h1>
            <p>Consultá y administrá las reservas.</p>

            <div className="panel-bloque">
              <h2>Listado de turnos</h2>

              <div className="tabla-contenedor">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Horario</th>
                      <th>Servicio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td colSpan="5">
                        Todavía no hay turnos registrados.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case "Clientes":
        return (
          <>
            <h1>Clientes</h1>
            <p>Información de los clientes registrados.</p>

            <div className="panel-bloque">
              <h2>Lista de clientes</h2>
              <p>Acá aparecerán los clientes registrados en MiTurno.</p>
            </div>
          </>
        );

      case "Puntos":
        return (
          <>
            <h1>Puntos</h1>
            <p>Administración del sistema de fidelización.</p>

            <div className="panel-bloque">
              <h2>Programa de puntos</h2>
              <p>
                Acá podrás consultar los puntos acumulados y canjeados
                por los clientes.
              </p>
            </div>
          </>
        );

      case "Servicios":
        return (
          <>
            <h1>Servicios</h1>
            <p>Administrá los servicios de la barbería.</p>

            <div className="panel-bloque">
              <h2>Servicios disponibles</h2>
              <p>
                Acá aparecerán los cortes, precios y duración de cada
                servicio.
              </p>
            </div>
          </>
        );

      case "Estadísticas":
        return (
          <>
            <h1>Estadísticas</h1>
            <p>Consultá el rendimiento de tu barbería.</p>

            <div className="panel-bloque">
              <h2>Resumen del negocio</h2>
              <p>
                Acá se mostrarán estadísticas de turnos, clientes y
                servicios.
              </p>
            </div>
          </>
        );

      default:
        return <h1>Inicio</h1>;
    }
  }

  return (
    <div className="panel-dueno">

      <aside className="panel-sidebar">

        <div className="panel-logo">
          <img src="/img/logo.png" alt="MiTurno" />
          <h2>MiTurno</h2>
        </div>

        <nav className="panel-menu">
          {opciones.map((opcion) => (
            <button
              key={opcion}
              className={
                seccion === opcion ? "menu-item activo" : "menu-item"
              }
              onClick={() => setSeccion(opcion)}
            >
              {opcion}
            </button>
          ))}
        </nav>

        <button
          className="cerrar-sesion"
          onClick={alCerrarSesion}
        >
          Cerrar sesión
        </button>

      </aside>

      <main className="panel-contenido">

        <header className="panel-header">
          <h2>Panel del dueño</h2>
          <span>MiTurno</span>
        </header>

        <section className="panel-seccion">
          {mostrarContenido()}
        </section>

      </main>

    </div>
  );
}

export default PanelDueno;
