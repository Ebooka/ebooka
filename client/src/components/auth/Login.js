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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { GoogleLogin } from 'react-google-login';
import Register from "./Register";
import Password from './Password';

const errorTypes = {
    LOGIN_FAIL: 'LOGIN_FAIL',
    REQUIRED: 'REQUIRED'
};

const errorMessages = {
    REQUIRED: 'Este campo es requerido.',
};

const errorSpan = (text) => (
    <span style={{color: 'red', fontSize: 12}}>{text}</span>
)

class Login extends Component {

    state = {
        username: '',
        password: '',
        error: null,
        msg: null,
        modal: false,
        missingFields: [],
        loading: false
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if(error !== prevProps.error) {
            if(error.id === 'LOGIN_FAIL')
                this.setState({ msg: error.msg.msg });
            else
                this.setState({ msg: null });
        }
        if(prevProps.loading !== this.props.loading) {
            this.setState({ loading: this.props.loading });
        }
        if(this.state.modal) {
            if(isAuthenticated) {
                this.toggle();
            }
        }
    };

    toggle = () => {
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    };

    hasMissingFields = () => {
        let missingFields = [];
        if(this.state.username === '') {
            missingFields.push('username');
        }
        if(this.state.password === '') {
            missingFields.push('password');
        }
        this.setState({ missingFields: missingFields });
        return missingFields.length > 0;
    }

    onLogin = (event) => {
        event.preventDefault();
        const { username, password } = this.state;
        if(this.hasMissingFields()) {
            return;
        }
        const user = {
            username,
            password
        };
        this.props.login(user);
    };

    googleLogin = (response) => {
        const user = {
            token: response.tokenObj.id_token,
        };
        this.props.login(user);
    }

    failure = obj => {
        console.log(obj);
    }

    render() {
        return (
            <div>
                <NavLink onClick={this.toggle} href="#">Ingresá</NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggle} style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', width: '100%', overflowY: 'scroll', maxHeight: '85%'}}>
                    <ModalHeader toggle={this.toggle}>Ingresá tus datos</ModalHeader>
                    <ModalBody>
                        <Form>
                            <div style={{marginLeft: 'auto', marginRight: 'auto', width: 'max-content'}}>
                                <GoogleLogin clientId="309248232315-k2qfk2ln63stjvlj5npeb7q7rt685l3v.apps.googleusercontent.com"
                                             onSuccess={this.googleLogin}
                                             onFailure={this.failure}
                                             cookiePolicy={'single_host_origin'}>Acceder con Google
                                </GoogleLogin>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap', margin: '8px auto'}}>
                                <div style={{width: '45%', height: 9, borderBottom: 'solid 1px #EEE'}}></div>
                                    <span style={{fontSize: 15}}>ó</span>
                                <div style={{width: '45%', height: 9, borderBottom: 'solid 1px #EEE'}}></div>
                            </div>
                            <FormGroup>
                                <Label for="name" style={{fontSize: 15}}>Nombre De Usuario</Label>
                                <Input type="text"
                                       name="username"
                                       id="username"
                                       placeholder="Ingresá tu nombre de usuario"
                                       style={ this.state.missingFields.includes('username') ? {borderColor: 'red'} : null }
                                       onChange={this.onChange} autoComplete="username"/>
                                {this.state.missingFields.includes('username') && errorSpan(errorMessages.REQUIRED)}
                            </FormGroup>
                            <FormGroup>
                                <Label for="password" style={{fontSize: 15}}>Contraseña</Label>
                                <Input type="password"
                                       name="password"
                                       id="password"
                                       placeholder="Ingresá tu contraseña"
                                       style={ this.state.missingFields.includes('password') ? {borderColor: 'red'} : null }
                                       autoComplete="new-password" onChange={this.onChange}/>
                                {this.state.missingFields.includes('password') && errorSpan(errorMessages.REQUIRED)}
                            </FormGroup>
                            {this.state.msg && <Alert color="secondary">{this.state.msg}</Alert>}
                            <FormGroup style={{ textAlign: 'center', marginTop: 30 }}>
                                <Button onClick={this.onLogin} style={{marginRight: 5, backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}}>
                                    { this.state.loading ? <Spinner color={'light'} size={'sm'}/> : 'Ingresar' }
                                </Button>
                                <Button onClick={this.toggle} style={{marginLeft: 5, color: '#EC1009', borderColor: '#EC1009'}} outline>Cancelar</Button>
                            </FormGroup>
                        </Form>
                        <hr/>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <p style={{color: 'black', paddingTop: '0.5rem', fontFamily: 'Public Sans'}}>
                                ¿No tenés una cuenta todavía?
                            </p>
                            <Register/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <p style={{color: 'black', paddingTop: '0.5rem', fontFamily: 'Public Sans'}}>
                                ¿Te olvidaste tu contraseña?
                            </p>
                            <Password/>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    };
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    loading: state.auth.isLoading
});

export default connect(mapStateToProps, { login, clearErrors })(Login);
