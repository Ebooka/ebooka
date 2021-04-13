import React, {Component} from "react";

class EnterpriseLinks extends Component {

    render() {
        return (
            <div className={'links-container'} style={{textAlign: 'left', padding: 0}}>
                <ul style={{listStyle: 'none'}}>
                    <li><a href={'/about-us'} style={{color: 'black'}}>Acerca de</a></li>
                    <li><a href={'/terms-and-conditions'} style={{color: 'black'}}>Términos y condiciones</a></li>
                    <li><a href={'/cookies'} style={{color: 'black'}}>Cookies</a></li>
                    <p style={{fontFamily: 'Public Sans', color: 'black'}}>{`Editorial © ${new Date().getFullYear()}`}</p>
                </ul>
            </div>
        )
    }
}

export default EnterpriseLinks;