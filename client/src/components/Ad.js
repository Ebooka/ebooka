import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';

class Ad extends Component {
    render() {
        return (
            <Jumbotron>
                <h3 className="display-3">Publicidad</h3>
                <p>Este es un recuadro para poner cualquier publicidad</p>
                <hr/>
                <a href="https://www.youtube.com/watch?v=oUNDPqaqb6U"><button className="btn btn-primary" type="button">Ver más</button></a>
            </Jumbotron>
        )
    }
}

export default Ad;