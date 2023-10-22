import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL
} from "../../actions/types";

class Validate extends Component {

    componentDidMount() {

        const token = window.location.href.split('validate/')[1];
        axios.post(`${process.env.REACT_APP_API_URL}/api/users/validate`, {token: token})
            .then(res => {
                this.props.dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data
                });
                window.location.href = '/';
            })
            .catch(error => {
                this.props.dispatch({
                    type: LOGIN_FAIL,
                    payload: error.response?.data ?? {}
                })
            });
    }

    render() {
        return (
            <div style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '90%', textAlign: 'justify', width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: 20, overflowY: 'scroll'}}>
                Cargando...
            </div>
        );
    }
}

export default connect(null, null)(Validate);