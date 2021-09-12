import React from "react";
import '../style/TextStyle.css';
import '../style/Cookies.css';
class Cookies extends React.Component {

    render() {
        return (
            <div id={'cookies-container'}
                 style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '90%', textAlign: 'justify', width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: 20, overflowY: 'scroll'}}>
                <div className={'text-container'}>
                    <h3 className={'title'}>¿Qué son las cookies?</h3>

                    <p className={'regular'}>Las cookies son pequeños archivos de texto que contienen una cadena de caracteres que se puede colocar en una computadora o un dispositivo móvil y sirve para identificar de forma exclusiva un navegador o dispositivo. Podemos usar ciertas tecnologías, como las cookies, los píxeles y el almacenamiento local, para proporcionar y proteger productos, servicios y anuncios, así como para conocer su funcionamiento.
                        Las cookies las puede instalar la web que estás visitando (son las llamadas “cookies propias”) u otras webs cuyo contenido se ejecuta en la web que estás visitando (son las llamadas “cookies de terceros”).</p>

                    <h3 className={'title'}>¿Para que se usan las cookies?</h3>

                    <p className={'regular'}>Las cookies, y otras tecnologías, permiten a los sitios web o a ciertos servicios saber si se accedió a ellos desde una computadora o un dispositivo determinados. Estas tecnologías se pueden usar para proporcionar productos, servicios y anuncios. También nos permiten conocer el uso que se realiza de un sitio web o servicio, nos ayudan a recordar preferencias, hacen que la navegación entre las distintas páginas resulte más eficaz y, por lo general, mejoran la experiencia de uso de nuestros servicios. Asimismo, gracias a las cookies, el contenido de marketing que se muestra en internet resulta más relevante y está más relacionado con los intereses de cada persona.</p>

                    <h3 className={'title'}>¿Por qué utilizamos cookies y tecnologías similares?</h3>

                    <p className={'regular'}>Las cookies nos ayudan a prestar, proteger y mejorar los Productos de EBOOKA; por ejemplo, nos permiten personalizar el contenido, adaptar los anuncios y medir su rendimiento, así como brindar una mayor seguridad. Aunque las cookies que utilizamos pueden cambiar en determinadas circunstancias durante la mejora y la actualización de los Productos de EBOOKA, suelen utilizarse para los fines siguientes:</p>
                    <ul>
                        <li>
                            <p className={'li-title'}>Autenticación</p>
                            <p className={'regular'}>Utilizamos cookies para verificar tu cuenta y determinar cuándo inicias sesión en la plataforma, con el objetivo de ayudarte a acceder a los Productos de EBOOKA y mostrarte la experiencia y las funciones adecuadas.</p>
                        </li>
                        <li>
                            <p className={'li-title'}>Seguridad e integridad de los sitios web y los productos</p>
                            <p className={'regular'}>Utilizamos cookies para proteger tu cuenta, tus datos y los Productos de EBOOKA. Asimismo, utilizamos cookies para luchar contra aquellas actividades que puedan infringir nuestras políticas o minar, de cualquier otro modo, nuestra capacidad para proporcionar los Productos de EBOOKA.</p>
                        </li>
                        <li>
                            <p className={'li-title'}>Publicidad, recomendaciones, estadísticas y mediciones</p>
                            <p className={'regular'}>Utilizamos cookies para mostrar anuncios de empresas y organizaciones y recomendarlas a personas que pueden estar interesadas en los productos, los servicios o las causas que promocionan. También utilizamos cookies para medir el rendimiento de las campañas publicitarias de empresas que utilizan los Productos de EBOOKA. Las cookies nos ayudan a mostrar y medir anuncios en los diferentes navegadores y dispositivos que utiliza una persona. También nos permiten proporcionar estadísticas sobre las personas que usan los Productos de EBOOKA y aquellas que interactúan con los anuncios, los sitios web y las aplicaciones de nuestros anunciantes y de las empresas que utilizan dichos productos. Utilizamos cookies para ayudarte a indicar que no quieres ver determinados anuncios de EBOOKA en función de tu actividad en sitios web de terceros. Tanto EBOOKA como nuestros socios publicitarios pueden utilizar estas tecnologías para entregar publicidad relevante en función de los intereses de las personas. Estas tecnologías nos permiten recordar si se visitó un sitio web o servicio desde un dispositivo y hacer un seguimiento de la navegación realizada desde él en otros sitios web o servicios externos a EBOOKA. Esta información se puede compartir con organizaciones ajenas a EBOOKA, como anunciantes o redes publicitarias, para entregar publicidad y ayudarlas a medir la eficacia de las campañas publicitarias. Podemos usar estas tecnologías para optimizar e investigar los productos y servicios, y ampliar nuestro conocimiento sobre ellos.</p>
                        </li>
                        <li>
                            <p className={'li-title'}>Funciones y servicios para sitios web</p>
                            <p className={'regular'}>Utilizamos cookies para habilitar las funciones que nos ayudan a proporcionar los Productos de EBOOKA.</p>
                        </li>
                        <li>
                            <p className={'li-title'}>Rendimiento</p>
                            <p className={'regular'}>Utilizamos cookies para ofrecerte la mejor experiencia posible.</p>
                        </li>
                        <li>
                            <p className={'li-title'}>Análisis y estudios</p>
                            <p className={'regular'}>Utilizamos cookies para conocer mejor cómo se utilizan los Productos de EBOOKA, con el fin de mejorarlos.</p>
                        </li>
                    </ul>

                    <h3 className={'title'}>¿Cuánto tiempo permanecerán las cookies en mi dispositivo?</h3>

                    <p className={'regular'}>El tiempo que una cookie permanece en una computadora o un dispositivo varía en función de si se trata de una cookie permanente o de sesión. Las cookies de sesión sólo permanecen en el dispositivo hasta que se detiene la navegación. Sin embargo, las permanentes se conservan en la computadora o el dispositivo móvil hasta que caducan o se eliminan.</p>

                    <h3 className={'title'}>Cookies propias y de terceros</h3>

                    <p className={'regular'}>Las cookies propias son cookies que pertenecen a EBOOKA, mientras que las cookies de terceros son cookies que un tercero coloca en un dispositivo mediante nuestro servicio. Es posible que un tercero que proporcione un servicio para EBOOKA coloque cookies de terceros en un dispositivo, por ejemplo, para ayudarnos a entender mejor el uso que se hace de nuestro servicio. Nuestros socios comerciales también pueden colocar cookies de terceros en un dispositivo para anunciar productos y servicios desde cualquier ubicación de internet.</p>

                    <h3 className={'title'}>Cómo controlar las cookies y otros mecanismos de recopilación</h3>

                    <p className={'regular'}>Sigue las instrucciones provistas por el navegador de tu celular o sitio web (por lo general se encuentran en las secciones "Ayuda", "Herramientas" o "Editar") para modificar tu configuración de cookies. Ten en cuenta que, si configuras el navegador para desactivar las cookies u otras tecnologías, tal vez no puedas acceder a algunas áreas de nuestro servicio o es posible que estas no funcionen correctamente.
                    Si quieres eliminar la publicidad originada por las cookies de terceros, también tienes la opción de instalar en tu navegador un plugin como Adblock, que bloquee los anuncios.
                        Por último, puedes gestionar las cookies instaladas por Adobe Flash Player desde la web de Adobe.</p>
                </div>
            </div>
        )
    }
}

export default Cookies;