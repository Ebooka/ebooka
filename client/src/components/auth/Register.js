import React, { Component } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Modal,
    NavLink,
    ModalHeader,
    ModalBody,
    Alert,
    Spinner
} from 'reactstrap';
import { clearErrors } from '../../actions/errorActions';
import { registerUser } from '../../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { REGISTER_FAIL } from '../../actions/types';
import { GoogleLogin } from 'react-google-login';

const iconPath = process.env.PUBLIC_URL + '/assets/';

const errorTypes = {
    USERNAME_TOO_SHORT: 'USERNAME_TOO_SHORT',
    PASSWORDS_DONT_MATCH: 'PASSWORDS_DONT_MATCH',
    REGISTER_FAIL: 'REGISTER_FAIL'
};

const errorMessages = {
    REQUIRED: 'Este campo es requerido.',
    USERNAME_TOO_SHORT: 'El nombre de usuario debe tener al menos 6 caracteres.',
    PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden.'
};

const errorSpan = (text) => (
    <span style={{color: 'red', fontSize: 12}}>{text}</span>
)

class Register extends Component {

    state = {
        name: '',
        username: '',
        email: '',
        password: '',
        passwordCheck: '',
        msg: '',
        alert: '',
        error: null,
        modal: false,
        loading: false,
        googleMsg: '',
        missingFields: []
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
        const { error } = this.props;
        if(error !== prevProps.error) {
            if(error.id === 'REGISTER_FAIL')
                this.setState({
                    error: error.id,
                    alert: error.msg.msg
                });
        } else if(prevProps.message !== this.props.message) {
            if(this.state.username !== '') {
                this.setState({
                    alert: this.props.message
                });
            } else {
                this.setState({googleMsg: '¡Registración exitosa! Iniciá sesión y disfrutá de Ebooka.'});
            }
        }
        if(prevProps.loading !== this.props.loading) {
            this.setState({ loading: this.props.loading });
        }
    }

    hasMissingFields = () => {
        let missingFields = [];
        if(this.state.name === '') {
            missingFields.push('name');
        }
        if(this.state.username === '') {
            missingFields.push('username');
        }
        if(this.state.email === '') {
            missingFields.push('email');
        }
        if(this.state.password === '') {
            missingFields.push('password');
        }
        if(this.state.passwordCheck === '') {
            missingFields.push('passwordCheck');
        }
        this.setState({ missingFields: missingFields });
        return missingFields.length > 0;
    }

    onRegister = async (event) => {
        event.preventDefault();
        this.props.clearErrors();
        const { name, username, email, password, passwordCheck } = this.state;
        const defaultImageURL = `${iconPath}user.png`;
        const externalAccount = false;
        if(this.hasMissingFields()) {
            return;
        }
        if(username.length < 6) {
            this.setState({
                error: errorTypes.USERNAME_TOO_SHORT,
                msg: errorMessages.USERNAME_TOO_SHORT
            });
        } else if(password !== passwordCheck) {
            this.setState({
                error: errorTypes.PASSWORDS_DONT_MATCH,
                msg: errorMessages.PASSWORDS_DONT_MATCH
            });
        } else {
            const newUser = {
                name,
                username,
                email,
                password,
                defaultImageURL,
                externalAccount,
                needsValidation: true,
            };
            this.props.registerUser(newUser);
        }
    }

    googleRegister = (response) => {
        this.props.registerUser({token: response.tokenObj.id_token});
    }

    render() {
        console.log(this.state.error, errorTypes.USERNAME_TOO_SHORT, this.state.error && this.state.error === errorTypes.USERNAME_TOO_SHORT, this.state.msg)
        return (
            <div>
                <NavLink onClick={this.toggle} href="#">Registrate</NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggle} style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', width: '99%', overflowY: 'auto', maxHeight: '85%'}}>
                    <ModalHeader toggle={this.toggle}>Creá tu cuenta</ModalHeader>
                    <ModalBody>
                        <Form>
                            {
                                this.state.googleMsg.length > 0 &&
                                <Alert color="secondary">{this.state.googleMsg}</Alert>
                            }
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
                                <Input type="text"
                                       name="name"
                                       id="name"
                                       placeholder="Ingresá tu nombre completo"
                                       style={this.state.missingFields.includes('name') ? {borderColor: 'red'} : null}
                                       onChange={this.onChange}/>
                                {this.state.missingFields.includes('name') && errorSpan(errorMessages.REQUIRED)}
                            </FormGroup>
                            <FormGroup>
                                <Label for="username" style={{fontSize: 15}}>Nombre De Usuario</Label>
                                <Input type="text"
                                       name="username"
                                       id="username"
                                       placeholder="Ingresá tu nombre de usuario"
                                       style={this.state.missingFields.includes('username') ||
                                             (this.state.error && this.state.error === errorTypes.USERNAME_TOO_SHORT) ?
                                             {borderColor: 'red'} : null}
                                       onChange={this.onChange}
                                       autoComplete="username"/>
                                {this.state.missingFields.includes('username') && errorSpan(errorMessages.REQUIRED)}
                                {this.state.error && this.state.error === errorTypes.USERNAME_TOO_SHORT && errorSpan(this.state.msg)}
                            </FormGroup>
                            <FormGroup>
                                <Label for="email" style={{fontSize: 15}}>Email</Label>
                                <Input type="email"
                                       name="email"
                                       id="email"
                                       placeholder="Ingresá tu email"
                                       style={this.state.missingFields.includes('email') ? {borderColor: 'red'} : null}
                                       onChange={this.onChange}/>
                                {this.state.missingFields.includes('email') && errorSpan(errorMessages.REQUIRED)}
                            </FormGroup>
                            <FormGroup>
                                <Label for="password" style={{fontSize: 15}}>Contraseña</Label>
                                <Input type="password"
                                       name="password"
                                       id="password"
                                       placeholder="Ingresá tu contraseña"
                                       style={this.state.missingFields.includes('password')
                                            || this.state.error === errorTypes.PASSWORDS_DONT_MATCH ?
                                                {borderColor: 'red'} : null}
                                       onChange={this.onChange}/>
                                {this.state.missingFields.includes('password') && errorSpan(errorMessages.REQUIRED)}
                                {this.state.error && this.state.error === errorTypes.PASSWORDS_DONT_MATCH && errorSpan(this.state.msg)}
                            </FormGroup>
                            <FormGroup>
                                <Label for="password" style={{fontSize: 15}}>Reingresá tu contraseña</Label>
                                <Input type="password"
                                       name="passwordCheck"
                                       id="passwordCheck"
                                       placeholder="Reingresá tu contraseña"
                                       style={this.state.missingFields.includes('passwordCheck')
                                            || this.state.error === errorTypes.PASSWORDS_DONT_MATCH ?
                                            {borderColor: 'red'} : null}
                                       onChange={this.onChange}/>
                                {this.state.missingFields.includes('passwordCheck') && errorSpan(errorMessages.REQUIRED)}
                                {this.state.error && this.state.error === errorTypes.PASSWORDS_DONT_MATCH && errorSpan(this.state.msg)}
                            </FormGroup>
                            <p style={{fontFamily: 'Public Sans'}}>
                                Al registrarse, se dan por aceptados los <u><a href={'/terms-and-conditions'} style={{textDecoration: 'none', color: 'darkslategray'}}>Términos y Condiciones</a></u> y la <u><a href={'/cookies'} style={{textDecoration: 'none', color: 'darkslategray'}}>Política de Cookies</a></u>
                            </p>
                            {
                                this.state.alert?.length > 0 &&
                                <Alert color="secondary">{this.state.alert}</Alert>
                            }
                            <FormGroup style={{ textAlign: 'center', marginTop: 30 }}>
                                <Button onClick={this.onRegister}
                                        style={{marginRight: 5, backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}}>
                                    { this.state.loading ? <Spinner color={'light'} size={'sm'}/> : 'Crear cuenta' }
                                </Button>
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
    error: state.error,
    message: state.auth.message,
    loading: state.auth.isLoading,
});

export default connect(mapStateToProps, { registerUser, clearErrors })(Register);
