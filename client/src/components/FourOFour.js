import React, { Component } from 'react'

export class FourOFour extends Component {
    render() {
        return (
            <div style={{position: 'fixed', left: '50%', transform: 'translate(-50%, 0)', top: 90, textAlign: 'center'}}>
                <h1>Error 404</h1>
                <h3>Página no encontrada!</h3>
            </div>
        )
    }
}

export default FourOFour
