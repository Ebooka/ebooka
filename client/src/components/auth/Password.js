import React, { Component } from 'react';
import Alert from 'reactstrap/lib/Alert';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import NavLink from 'reactstrap/lib/NavLink';
import { clearErrors } from '../../actions/errorActions';
import { connect } from 'react-redux';
import { sendPasswordEmail } from '../../actions/authActions';
import {Spinner} from "reactstrap";
import '../../style/PasswordModal.css';

class Password extends Component {

    state = {
        modal: false,
        email: '',
        msg: null,
        sendSuccess: false,
        sendError: false,
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props, prevProps, this.state, prevState);
        if(!this.props.isLoading && prevProps.isLoading && !this.props.sendingEmailError) {
            this.setState({sendSuccess: true});
        }
        if(!this.props.isLoading && prevProps.isLoading && this.props.sendingEmailError) {
            this.setState({sendError: true});
        }
        if(!prevProps.isLoading && this.props.isLoading) {
            this.setState({
                sendError: false,
                sendSuccess: false,
            });
        }
    }

    sendEmail = () => {
        this.props.sendPasswordEmail(this.state.email);
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    toggle = () => {
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    };

    render() {
        return (
            <div>
                <NavLink onClick={this.toggle} href={'#'}>Recuperala acá.</NavLink>
                <Modal isOpen={this.state.modal}
                       toggle={this.toggle}
                       className={'email-modal'}
                       style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', overflowY: 'scroll'}}
                >
                    <ModalHeader toggle={this.toggle}>Recuperá tu contraseña</ModalHeader>
                    <ModalBody>
                        {
                            this.state.msg ?
                                <Alert color="danger">{this.state.msg}</Alert>
                                : null
                        }
                        <Label for="email">Email</Label>
                        <Input type="email" name="email"
                               placeholder="Ingresá tu email"
                               onChange={this.onChange}/>
                        {
                            this.state.sendSuccess &&
                            <div className="alert alert-success" role="alert">
                                Email enviado a su cuenta. Revise su correo.
                            </div>
                        }
                        {
                            this.state.sendError &&
                            <div className="alert alert-success" role="alert">
                                Error enviando email. Intente de nuevo más tarde.
                            </div>
                        }
                        <div className={'button-container'}>
                            <Button onClick={this.toggle}>Cancelar</Button>
                            <Button onClick={this.sendEmail}>
                                {
                                    this.props.isLoading ?
                                        <Spinner color={'light'} size={'sm'}>{''}</Spinner> :
                                        'Enviar email'
                                }
                            </Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    error: state.error,
    isLoading: state.auth.isLoading,
    sendingEmailError: state.auth.sendingEmailError,
});

export default connect(mapStateToProps, { clearErrors, sendPasswordEmail })(Password);
