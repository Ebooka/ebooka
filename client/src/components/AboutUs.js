import React, {Component} from "react";
import '../style/AboutUs.css';

class AboutUs extends Component {

    render() {
        return (
            <div id={'terms-container'} style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '90%', textAlign: 'justify', width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: 20, overflowY: 'scroll'}}>
                <div className={'row'}>
                    <div className={'col-lg-6 col-xs-12'}>
                        <div className={'about-us-img-container-left'}>
                            <img src={'/assets/about-us-1.jpg'} className={'about-us-img'} height={500} width={600}/>
                        </div>
                    </div>
                    <div className={'col-lg-6 col-xs-12 text-container'}>
                        <p className={'about-us-text'}> Ebooka es una red social para escritores y lectores.
                            Creemos que es hora que los escritores amateurs tengan un lugar para encontrarse y hacerse conocer; un espacio para poder expresarse.
                            Es una comunidad formada por los valores de confianza, inspiración, libertad, pasión y respeto.
                            Donde esperamos que cada usuario encuentre su lugar pudiendo plasmar su arte y hallándose en un nuevo estilo de mundo literario.</p>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-lg-6 col-xs-12 col-sm-12 text-container'}>
                        <p className={'about-us-text'}> Cada uno de ustedes forma Ebooka, por lo que es tendencia y vanguardia, ya que siempre se renueva.
                            Esperamos que encuentres en Ebooka tu lugar para expresarte, y así también sentirte escuchado.
                            Tu privacidad y conformidad es lo que más nos importa; siempre lo vamos a tener como principio.
                            ¡Bienvenido, te esperábamos!</p>
                    </div>
                    <div className={'col-lg-6 col-xs-12'}>
                        <div className={'about-us-img-container-right'}>
                            <img src={'/assets/about-us-2.jpg'} className={'about-us-img'} height={500} width={600}/>
                        </div>
                    </div>
                </div>
            </div>);
    }

}

export default AboutUs;