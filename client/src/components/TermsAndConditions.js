import React, {Component} from "react";
import '../style/TextStyle.css';

class TermsAndConditions extends Component {

    render() {
        return (
            <div id={'terms-container'} style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '90%', textAlign: 'justify', width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: 20, overflowY: 'scroll'}}>
                <p className={'title'}>POLÍTICA DE PRIVACIDAD</p>

                <p className={'sub-title'}>¿Con qué finalidad tratamos tus datos personales?</p>
                <p className={'regular'}>En EBOOKA tratamos la información que nos facilitan las personas interesadas con el fin de poder informarle sobre nuestros productos, servicios, novedades, sorteos, concursos y eventos, así como la gestión de su inscripción y participación a sorteos, concursos o eventos que solicite participar. Si se tomasen decisiones automatizadas en base a dicha información será informado debidamente en la política de protección de datos antes de recabar sus datos en el formulario de registro de nuestras plataformas web.
                    Las diferentes finalidades de tratamiento posibles son:</p><br/>
                <p className={'regular'}>Al crear una cuenta en la web, suscribirse a nuestras newsletters o participar en una promoción, se genera un perfil con la información básica, de intereses y preferencias declaradas por el usuario, asociados con el contenido de interés o a la temática del concurso en el que participa. Esta información es utilizada para adaptar el contenido de la web, productos, promociones o eventos a los temas de mayor relevancia para el usuario. En el caso de creación de una cuenta a través de formulario se generan unas credenciales de acceso para que el usuario pueda cambiar su información y preferencias en cualquier momento. Al generar el perfil el usuario acepta recibir comunicaciones relativas a la creación de su cuenta, modificación de condiciones, gestión de usuarios en general o participación en concursos.
                Adicionalmente, el usuario podrá aceptar o no recibir comunicaciones comerciales generales o adaptadas a sus intereses y preferencias declarados, al tipo de contenido al que se ha suscrito o asociadas a los concursos en los que participa.
                Por otra parte, el usuario podrá aceptar o no recibir comunicaciones automatizadas comerciales adaptadas a su comportamiento en la web ya sea de navegación o de compra si existiera el caso.
                Los datos personales proporcionados se conservarán hasta que se solicite su supresión  o revoque su consentimiento por el interesado.
                La base legal para el tratamiento de sus datos con la finalidad de poder informarle por vía electrónica sobre nuestros productos, servicios, novedades, sorteos, concursos y eventos de EBOOKA así como la gestión de su inscripción y participación a sorteos, concursos o eventos que solicite, es la aportación del consentimiento. El consentimiento será válido hasta que decida revocarlo, eliminando la cuenta.
                Adoptamos las medidas necesarias para evitar su alteración, tratamiento o acceso no autorizado, habida cuenta en todo momento del estado de la tecnología.</p>

                <p className={'title'}>ACEPTACIÓN</p>

                <p className={'regular'}>Al acceder y utilizar este servicio, estás aceptando y accediendo a los términos y condiciones de este acuerdo. Asimismo, al utilizar estos servicios particulares, usted estará sujeto a toda regla o guía de uso correspondiente que se haya publicado para dichos servicios. Toda participación en este servicio constituirá la aceptación de este acuerdo. Si no acepta cumplir con lo anterior, por favor, no lo utilice.</p>

                <p className={'title'}>CONDICIONES DE USO</p>

                <p className={'sub-title'}>Derechos de propiedad intelectual</p>
                <p className={'regular'}>El Servicio y todos los materiales incluidos o transferidos, incluyendo, sin limitación, software, imágenes, texto, gráficos, logotipos, patentes, marcas registradas, marcas de servicio, derechos de autor, fotografías, audio, videos, música y todos los Derechos de Propiedad Intelectual relacionados con ellos, son la propiedad exclusiva de EBOOKA. Salvo que se indique explícitamente en este documento, no se considerará que nada en estos Términos crea una licencia en o bajo ninguno de dichos Derechos de Propiedad Intelectual, y tú aceptas no vender, licenciar, alquilar, modificar, distribuir, copiar, reproducir, transmitir, exhibir públicamente, realizar públicamente, publicar, adaptar, editar o crear trabajos derivados de los mismos.</p>

                <p className={'sub-title'}>Derecho a suspender o cancelar la cuenta de usuario</p>
                <p className={'regular'}>Podemos terminar o suspender de manera permanente o temporal tu acceso al servicio sin previo aviso y responsabilidad por cualquier razón, incluso si a nuestra sola determinación se viola alguna disposición de estos Términos o cualquier ley o regulación aplicable. Puedes descontinuar el uso y solicitar cancelar tu cuenta y / o cualquier servicio en cualquier momento.</p>

                <p className={'sub-title'}>Emails de promociones y contenido</p>
                <p className={'regular'}>Acepta recibir de vez en cuando nuestros mensajes y materiales de promoción, por correo postal, correo electrónico o cualquier otro formulario de contacto que nos proporciones (incluido tu número de teléfono para llamadas o mensajes de texto). Si no deseas recibir dichos materiales o avisos de promociones, simplemente avísanos en cualquier momento.</p>

                <p className={'sub-title'}>Derecho a cambiar y modificar los Términos</p>
                <p className={'regular'}>Nos reservamos el derecho de modificar estos términos de vez en cuando a nuestra entera discreción. Por lo tanto, debes revisar estas páginas periódicamente. Cuando cambiemos los Términos de una manera material, te notificaremos que se han realizado cambios importantes en los Términos. El uso continuado de la página web o nuestro servicio después de dicho cambio constituye tu aceptación de los nuevos Términos. Si no aceptas alguno de estos términos o cualquier versión futura de los Términos, no uses o  accedas (o continúes accediendo) a la página web o al servicio.</p>

                <p className={'date'}><b>Efectivo:</b> 15/02/2021</p>

            </div>
        );
    }

}

export default TermsAndConditions;