
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">

        <div className="footer-marca">
          <img src="/img/logob.png" alt="Bellux Barber" />
          <h2>BELLUX BARBER</h2>
          <p>Estilo y precisión en cada corte.</p>
        </div>

        <div className="footer-enlaces">
          <h3>Navegación</h3>
          <a href="#galeria">Galería</a>
          <a href="#servicios">Servicios</a>
          <a href="#ubicacion">Ubicación</a>
        </div>

        <div className="footer-contacto">
          <h3>Contacto</h3>
          <p>Benito Juárez, Buenos Aires</p>
          <p>Lunes a domingo</p>
          <p>10:00 a 20:00 hs.</p>
        </div>

      </div>

      <div className="footer-inferior">
        <p>© {new Date().getFullYear()} Bellux Barber. Todos los derechos reservados.</p>
        <span>Diseñado para destacar tu estilo.</span>
      </div>
    </footer>
  );
}

export default Footer;
