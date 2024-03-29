import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Modal, NavLink, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { clearErrors } from '../../actions/errorActions';
import { registerUser } from '../../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { REGISTER_FAIL } from '../../actions/types';
import { GoogleLogin } from 'react-google-login';

const iconPath = process.env.PUBLIC_URL + '/assets/';

class Register extends Component {

    state = {
        name: '',
        username: '',
        email: '',
        password: '',
        passwordCheck: '',
        msg: null,
        modal: false
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    toggle = () => {
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if(error !== prevProps.error) {
            if(error.id === 'REGISTER_FAIL')
                this.setState({ msg: error.msg.msg });
            else
                this.setState({ msg: null });
        }
        if(this.state.modal) {
            if(isAuthenticated)
                this.toggle();
        }
    }

    onRegister = (event) => {
        event.preventDefault();
        this.props.clearErrors();
        const { name, username, email, password, passwordCheck } = this.state;
        const defaultImageURL = `${iconPath}user.png`;
        const externalAccount = false;
        if(username.length < 6) {
            const usrInput = document.getElementById('username');
            usrInput.style.border = '1px solid red';
            this.setState({
                error: REGISTER_FAIL,
                msg: 'El nombre de usuario debe contener al menos 6 caracteres!'
            });
        } else if(password !== passwordCheck) {
            const pswdInput = document.getElementById('password');
            pswdInput.style.border = '1px solid red';
            const pswdChkInput = document.getElementById('passwordCheck');
            pswdChkInput.style.border = '1px solid red';
            this.setState({
                error: REGISTER_FAIL,
                msg: 'Las contraseñas no coinciden!'
            });
        } else {
            const newUser = {
                name,
                username,
                email,
                password,
                defaultImageURL,
                externalAccount,
                needsValidation: true
            };
            this.props.registerUser(newUser);
        }
    }

    googleRegister = (response) => {
        this.props.registerUser({token: response.tokenObj.id_token});
    }

    facebookRegister = (response) => {
        const name = response.name;
        const username = response.name;
        const email = response.email;
        const password = response.id;
        const defaultImageURL = response.picture.data.url;
        const newUser = {
            name,
            username,
            email,
            password,
            defaultImageURL,
            needsValidation: false
        };
        this.props.registerUser(newUser);
    }

    render() {
        return (
            <div>
                <NavLink onClick={this.toggle} href="#">Registrate</NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggle} style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', width: '100%', overflowY: 'scroll', maxHeight: '85%'}}>
                    <ModalHeader toggle={this.toggle}>Creá tu cuenta</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? (
                            <Alert color="secondary">{this.state.msg}</Alert>
                        ) : null}
                        <Form>
                            <div style={{marginLeft: 'auto', marginRight: 'auto', width: 'max-content'}}>
                                <GoogleLogin clientId="309248232315-k2qfk2ln63stjvlj5npeb7q7rt685l3v.apps.googleusercontent.com"
                                            onSuccess={this.googleRegister}
                                            cookiePolicy={'single_host_origin'}>Accedé con Google
                                </GoogleLogin>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap', margin: '8px auto'}}>
                                <div style={{width: '45%', height: 9, borderBottom: 'solid 1px #EEE'}}></div>
                                    <span style={{fontSize: 15}}>ó</span>
                                <div style={{width: '45%', height: 9, borderBottom: 'solid 1px #EEE'}}></div>
                            </div>
                            <FormGroup>     
                                <Label for="name" style={{fontSize: 15}}>Nombre Completo</Label>
                                <Input type="text" name="name" id="name" placeholder="Ingresá tu nombre completo" onChange={this.onChange}/> 
                            </FormGroup>
                            <FormGroup>
                                <Label for="username" style={{fontSize: 15}}>Nombre De Usuario</Label>
                                <Input type="text" name="username" id="username" placeholder="Ingresá tu nombre de usuario" onChange={this.onChange} autoComplete="username"/> 
                            </FormGroup>
                            <FormGroup>
                                <Label for="email" style={{fontSize: 15}}>Email</Label>
                                <Input type="email" name="email" id="email" placeholder="Ingresá tu email" onChange={this.onChange}/> 
                            </FormGroup>
                            <FormGroup>
                                <Label for="username" style={{fontSize: 15}}>Contraseña</Label>
                                <Input type="password" name="password" id="password" placeholder="Ingresá tu contraseña" onChange={this.onChange}/> 
                            </FormGroup>
                            <FormGroup>
                                <Label for="password" style={{fontSize: 15}}>Reingresá tu contraseña</Label>
                                <Input type="password" name="passwordCheck" id="passwordCheck" placeholder="Reingresá tu contraseña" onChange={this.onChange}/>
                            </FormGroup>
                            <p style={{fontFamily: 'Public Sans'}}>Al registrarse, se dan por aceptados los  <u><a href={'/terms-and-conditions'} style={{textDecoration: 'none', color: 'darkslategray'}}>Términos y Condiciones.</a></u></p>
                            <FormGroup style={{ textAlign: 'center', marginTop: 30 }}>
                                <Button onClick={this.onRegister} style={{marginRight: 5, backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}}>Crear cuenta</Button>
                                <Button onClick={this.toggle} style={{marginLeft: 5, color: '#EC1009', borderColor: '#EC1009'}} outline>Cancelar</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { registerUser, clearErrors })(Register);
