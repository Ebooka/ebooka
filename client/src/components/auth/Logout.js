import React, { Component } from 'react'
import { NavLink }from 'reactstrap'
import PropTypes from 'prop-types';
import { logout } from '../../actions/authActions';
import {connect} from 'react-redux';

class Logout extends Component {
    
    static propTypes = {
        logout: PropTypes.func.isRequired
    };

    render() {
        return (
            <NavLink onClick={this.props.logout} style={{color: 'red', display: 'flex', marginLeft: 4}}>
                <img src={'/assets/logout.png'} alt={'logout'} height={30} width={30} style={{color: 'red'}}/>
                <p style={{fontFamily: 'Public Sans', marginTop: 0, marginBottom: 0}}>Cerrar sesión</p>
            </NavLink>
        )
    }
}

export default connect(null, { logout })(Logout);
