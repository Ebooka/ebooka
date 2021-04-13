import React, { Component } from 'react';
import Alert from 'reactstrap/lib/Alert';
import Button from 'reactstrap/lib/Button';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import Modal from 'reactstrap/lib/Modal';
import ModalBody from 'reactstrap/lib/ModalBody';
import ModalHeader from 'reactstrap/lib/ModalHeader';
import NavLink from 'reactstrap/lib/NavLink';
import { clearErrors } from '../../actions/errorActions';
import { connect } from 'react-redux';
import { sendPasswordEmail } from '../../actions/authActions';

class Password extends Component {

    state = {
        modal: false,
        email: '',
        msg: null
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
                <NavLink onClick={this.toggle} href="#">Recuperala acá.</NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Recuperá tu contraseña</ModalHeader>
                    <ModalBody>
                        { this.state.msg ? (
                            <Alert color="danger">{this.state.msg}</Alert>
                        ) : null}
                        <Form>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input type="email" name="email" placeholder="Ingresá tu email" onChange={this.onChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Button onClick={this.sendEmail}>Confirmar</Button>
                                <Button onClick={this.toggle}>Cancelar</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    error: state.error
});

export default connect(mapStateToProps, { clearErrors, sendPasswordEmail })(Password);
