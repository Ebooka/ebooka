import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { unblock } from '../actions/userActions';
import { connect } from 'react-redux';
import {modalStyle} from '../static/styleModal';

export class BlockedAccount extends Component {

    state = {
        unblockModalIsOpen: false
    }

    unblock = (event, blockedUser) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.unblock(this.props.auth.user.id, blockedUser.id);
        this.setState({ 
            unblockModalIsOpen: false
         });
         this.props.action(blockedUser);
    }

    toggleUnblockModal = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ unblockModalIsOpen: !this.state.unblockModalIsOpen });
    }

    render() {
        return (
            <div style={{marginTop: 20}}>
                <img src={this.props.account.profile_image} width="40" height="40" style={{marginLeft: 10, marginRight: 10, borderRadius: '50%'}}/>
                <a href={`/user/${this.props.account.username}`}>{this.props.account.username}</a>
                <Button color="info" onClick={this.toggleUnblockModal} style={{marginLeft: 20}}>Desbloquear</Button>
                <Modal isOpen={this.state.unblockModalIsOpen} toggle={this.toggleUnblockModal} style={modalStyle}>
                    <ModalHeader>{`Desbloquear a ${this.props.account.username}`}</ModalHeader>
                    <ModalBody>
                        <p>{`¿Estás seguro que deseas desbloquear a ${this.props.account.username}?`}</p>
                        <Button onClick={event => this.unblock(event, this.props.account)} color="info">Desbloquear</Button>
                        <Button onClick={this.toggleUnblockModal} color="secondary">Cancelar</Button>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { unblock })(BlockedAccount);
