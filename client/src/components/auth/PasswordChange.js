import axios from 'axios';
import React, { Component } from 'react'
import Alert from 'reactstrap/lib/Alert';
import Button from 'reactstrap/lib/Button';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import { PASSWORD_FAIL } from '../../actions/types';
import {Spinner} from "reactstrap";

class PasswordChange extends Component {

    state = {
        password: '',
        passwordCheck: '',
        msg: null,
        error: '',
        loading: false,
        passwordChangeError: false,
        passwordChangeSuccess: false
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.loading && !this.state.loading && !this.state.passwordChangeError) {
            this.setState({passwordChangeSuccess: true});
        }
    }

    changePassword = () => {
        const { password, passwordCheck } = this.state;
        if(password.length < 8) {
            document.getElementById('password').style.border = '1px solid red';
            this.setState({
                error: PASSWORD_FAIL,
                msg: 'La contraseña debe tener al menos 8 caracteres!'
            });
        } else if(passwordCheck !== password) {
            document.getElementById('password').style.border = '1px solid red';
            document.getElementById('passwordCheck').style.border = '1px solid red';
            this.setState({
                error: PASSWORD_FAIL,
                msg: 'Las contraseñas no coinciden!'
            });
        } else {
            this.setState({loading: true});
            axios.post(`${process.env.REACT_APP_API_URL}/api/auth/user/change-password`, {
                password: this.state.password,
                token: window.location.href.split('/password/')[1]
            })
                .then(res => {
                    this.setState({ msg: res.data.msg, loading: false })
                })
                .catch(err => {
                    this.setState({ loading: false, passwordChangeError: true })
                });
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)'}}>
                <h3>Cambiá tu contraseña</h3>
                <Label for="password">Ingresá la nueva contraseña</Label>
                <Input type="password" id="password" name="password" placeholder="Nueva contraseña" onChange={this.onChange}/>
                <Label for="passwordCheck">Reingresá la nueva contraseña</Label>
                <Input type="password" id="passwordCheck" name="passwordCheck" placeholder="Nueva contraseña" onChange={this.onChange}/>
                {
                    this.state.passwordChangeError &&
                    <div className="alert alert-success" role="alert">
                        Error modificando su contraseña. Intente de nuevo más tarde.
                    </div>
                }
                {
                    this.state.passwordChangeSuccess &&
                    <div className="alert alert-success" role="alert">
                        Contraseña modificada con éxito.
                    </div>
                }
                <Button onClick={this.changePassword}>
                    {
                        this.state.loading ?
                            <Spinner size={'sm'} color={'light'}>{''}</Spinner> :
                            'Cambiar contraseña'
                    }
                </Button>
            </div>
        )
    }
}

export default PasswordChange
