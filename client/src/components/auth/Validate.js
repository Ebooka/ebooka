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
        axios.post('/api/users/validate', {token: token})
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
                    payload: error.response.data
                })
            });
    }

    render() {
        return (
            <div>
                Cargando...
            </div>
        );
    }
}

export default connect(null, null)(Validate);