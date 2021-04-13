import axios from 'axios';
import React, { Component } from 'react'
import Alert from 'reactstrap/lib/Alert';
import Button from 'reactstrap/lib/Button';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import { PASSWORD_FAIL } from '../../actions/types';

class PasswordChange extends Component {

    state = {
        password: '',
        passwordCheck: '',
        msg: null,
        error: ''
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
            axios.post('/api/auth/user/change-password', {
                password: this.state.password,
                token: window.location.href.split('/password/')[1]
            })
            .then(res => this.setState({ msg: res.data.msg }));
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
                {this.state.msg ? (
                    <Alert color="danger">{this.state.msg}</Alert>
                ) : null}
                <Form>
                    <FormGroup>
                        <Label for="password">Ingresá la nueva contraseña</Label>
                        <Input type="password" id="password" name="password" placeholder="Nueva contraseña" onChange={this.onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="passwordCheck">Reingresá la nueva contraseña</Label>
                        <Input type="password" id="passwordCheck" name="passwordCheck" placeholder="Nueva contraseña" onChange={this.onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Button onClick={this.changePassword}>Cambiar contraseña</Button>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}

export default PasswordChange
