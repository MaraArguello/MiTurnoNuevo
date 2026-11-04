
import { useState, useEffect } from "react";
import "./App.css";
import Acceso from "./Acceso.jsx";
import DuenoLogin from "./DuenoLogin.jsx";
import PanelDueno from "./PanelDueno.jsx";

function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [turnoConfirmado, setTurnoConfirmado] = useState(null);
  const [turnosOcupados, setTurnosOcupados] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [cargando, setCargando] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState("");
  const [usuarioActual, setUsuarioActual] = useState(null);

  const horarios = [
    "10:00", "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00"
  ];

  useEffect(() => {
    async function cargarTurnos() {
      try {
        const respuesta = await fetch("http://localhost:3001/api/turnos");

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los turnos");
        }

        const turnos = await respuesta.json();
        setTurnosOcupados(turnos);
      } catch (error) {
        console.error("Error al cargar turnos:", error);
      }
    }

    cargarTurnos();
  }, []);

  function abrirReserva() {
    setPantalla("acceso");
  }

  function entrar(usuario) {
    setUsuarioActual(usuario);
    setPantalla("reserva");
  }

  function volverAlInicio() {
    setTurnoConfirmado(null);
    setFechaSeleccionada("");
    setHorarioSeleccionado("");
    setPantalla("inicio");
  }

  function solicitarOtroTurno() {
    setTurnoConfirmado(null);
    setFechaSeleccionada("");
    setHorarioSeleccionado("");
  }

  async function confirmarTurno(e) {
    e.preventDefault();

    if (cargando) return;

    if (!horarioSeleccionado) {
      alert("Elegí un horario.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Tu sesión venció. Iniciá sesión nuevamente.");
      setUsuarioActual(null);
      setPantalla("acceso");
      return;
    }

    const datos = new FormData(e.currentTarget);

    const nuevoTurno = {
      servicio: datos.get("servicio"),
      fecha: datos.get("fecha"),
      horario: horarioSeleccionado,
    };

    setCargando(true);

    try {
      const respuesta = await fetch("http://localhost:3001/api/turnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoTurno),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          localStorage.removeItem("token");
          setUsuarioActual(null);
          setPantalla("acceso");
          alert("Tu sesión venció. Iniciá sesión nuevamente.");
          return;
        }

        alert(resultado.error || "No se pudo guardar el turno.");
        return;
      }

      const turnoGuardado = {
        ...nuevoTurno,
        nombre: resultado.nombre,
        id: resultado.id,
      };

      setTurnosOcupados((anteriores) => [
        ...anteriores,
        turnoGuardado,
      ]);

      setTurnoConfirmado(turnoGuardado);

    } catch (error) {
      console.error("Error al guardar el turno:", error);

      alert(
        "No se pudo conectar con el servidor. Revisá que el backend esté funcionando."
      );
    } finally {
      setCargando(false);
    }
  }

  if (pantalla === "dueno")
    {
  return (
    <DuenoLogin
      alVolver={() => setPantalla("inicio")}
      alIngresar={() => setPantalla("panel-dueno")}
    />
    
  );
  
  }
  if (pantalla === "panel-dueno") {
  return (
    <PanelDueno
      alCerrarSesion={volverAlInicio}
    />
  );

}

  if (pantalla === "acceso") {
    return (
      <Acceso
        alIngresar={entrar}
        volver={() => setPantalla("inicio")}
      />
    );
  }

  if (pantalla === "reserva") {
    return (
      <div className="pagina">
        <div className="logo-reserva">
          <img
            src="/img/logo.png"
            alt="MiTurno"
            className="logo-imagen"
          />
        </div>

        <main className="contenido">
          {turnoConfirmado ? (
            <section className="confirmacion">
              <h2>¡Turno solicitado!</h2>
              <p>Estos son los datos de tu reserva:</p>

              <div className="tarjeta-confirmacion">
                <p><strong>Nombre:</strong> {turnoConfirmado.nombre}</p>
                <p><strong>Servicio:</strong> {turnoConfirmado.servicio}</p>
                <p><strong>Fecha:</strong> {turnoConfirmado.fecha}</p>
                <p><strong>Horario:</strong> {turnoConfirmado.horario}</p>
              </div>

              <button className="boton" onClick={solicitarOtroTurno}>
                Solicitar otro turno
              </button>
            </section>
          ) : (
            <form
              id="reservar"
              className="reserva-cliente"
              onSubmit={confirmarTurno}
            >
              <label className="campo-cliente">
                <span>👤</span>
                <input
                  name="nombre"
                  value={
                    usuarioActual
                      ? `${usuarioActual.nombre} ${usuarioActual.apellido}`
                      : ""
                  }
                  readOnly
                />
              </label>

              <label className="campo-reserva">
                Servicio
                <select name="servicio" required defaultValue="">
                  <option value="" disabled></option>
                  <option value="Corte clásico">Corte clásico</option>
                  <option value="Fade / Degradé">Fade / Degradé</option>
                  <option value="Barba">Barba</option>
                  <option value="Corte + Barba">Corte + Barba</option>
                </select>
              </label>

              <label className="campo-reserva">
                Fecha
                <input
                  name="fecha"
                  type="date"
                  required
                  min={new Date().toLocaleDateString("en-CA")}
                  value={fechaSeleccionada}
                  onChange={(e) => {
                    setFechaSeleccionada(e.target.value);
                    setHorarioSeleccionado("");
                  }}
                />
              </label>

              <div className="seleccion-horario">
                <p>Horario</p>

                <div className="grilla-horarios">
                  {horarios.map((hora) => {
                    const ocupado = turnosOcupados.some(
                      (turno) =>
                        String(turno.fecha).slice(0, 10) === fechaSeleccionada &&
                        String(turno.horario).slice(0, 5) === hora
                    );

                    return (
                      <button
                        key={hora}
                        type="button"
                        disabled={ocupado}
                        className={
                          horarioSeleccionado === hora
                            ? "horario activo"
                            : "horario"
                        }
                        onClick={() => setHorarioSeleccionado(hora)}
                      >
                        {hora}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                className="boton boton-reserva"
                type="submit"
                disabled={cargando}
              >
                {cargando ? "Guardando..." : "Reservar"}
              </button>

              <button
                className="boton boton-puntos"
                type="button"
                onClick={() => setPantalla("puntos")}
              >
                Mis Puntos
              </button>

              <button
                className="volver-inicio-reserva"
                type="button"
                onClick={() => setPantalla("inicio")}
              >
                Volver al inicio
              </button>
            </form>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="pagina">
      <header className="barra">
        <div className="logo">
          <img src="/img/logob.png" alt="Bellux Barber" />
        </div>

        <nav>
          <a href="#galeria">Galería</a>
          <a href="#servicios">Servicios</a>
          <a href="#ubicacion">Ubicación</a>

          <button
            className="boton boton-dueno"
            onClick={() => setPantalla("dueno")}
          >
          Dueño
          </button>

          <button className="boton" onClick={abrirReserva}>
            Reservar turno
          </button>
        </nav>
      </header>

      <section className="portada">
        <div className="portada-texto">
          <h1>BELLUX BARBER</h1>

          <h2>Estilo y precisión en cada corte</h2>

          <p className="descripcion">
            Cortes de calidad, atención personalizada y un estilo pensado para vos.
          </p>

          <button className="boton boton-sobre-mi">
            Sobre mí
          </button>
        </div>
      </section>

      <main className="contenido">
        <section id="galeria">
          <h2>Nuestros trabajos</h2>
          <p>Conocé algunos de nuestros cortes y estilos.</p>

          <div className="galeria">
            {[1, 2, 3, 4, 5, 6].map((numero) => (
              <img
                key={numero}
                src={`/img/${numero}.jpg`}
                alt={`Corte ${numero}`}
              />
            ))}
          </div>
        </section>

        <section id="servicios">
          <h2>Nuestros servicios</h2>

          <div className="tarjetas">
            <article>
              <h3>Corte clásico</h3>
              <p>Corte tradicional a tu gusto.</p>
              <strong>$5000</strong>
            </article>

            <article>
              <h3>Fade / Degradé</h3>
              <p>Degradado moderno y prolijo.</p>
              <strong>$5000</strong>
            </article>

            <article>
              <h3>Barba</h3>
              <p>Perfilado y arreglo de barba.</p>
              <strong>$2000</strong>
            </article>
          </div>
        </section>

        <section id="ubicacion">
          <h2>Ubicación y contacto</h2>
          <p>Benito Juárez, Buenos Aires</p>
          <p>Lunes a Domingo, de 10:00 a 20:00</p>
          <div className="mapa">
            <iframe
              title="Mapa de Benito Juárez"
              src="https://www.google.com/maps?q=Benito%20Juarez%20Buenos%20Aires&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
