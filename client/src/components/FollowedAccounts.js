import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { getFollowedAccountsById, getFollowedAccountsByUsername } from '../actions/userActions';
import {modalStyle} from '../static/styleModal';
import LikeRow from './LikeRow';

class FollowedAccounts extends Component {

    state = {
        modal: false,
    }

    toggle = () => {
        if(!this.state.modal) {
            if(this.props.userId)
                this.props.getFollowedAccountsById(this.props.userId);
            else
                this.props.getFollowedAccountsByUsername(this.props.username);
        }
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <>
                <div className="col-sm col-6" style={{padding: 0, textAlign: 'center', cursor:'pointer'}} onClick={this.toggle}>
                    <p style={sansStyle}>Seguidos</p>
                    <p style={sansStyle}>{this.props.followedUsers ? this.props.followedUsers.length : 0}</p>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} style={modalStyle}>
                    <ModalHeader toggle={this.toggle}>Seguidos</ModalHeader>
                    <ModalBody>
                        {this.props.accounts ?
                            this.props.accounts.map(followed => <LikeRow like={followed}/> ) :
                                                    <p>No sigues ninguna cuenta todavía.</p>}
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    accounts: state.user.accounts
});

const sansStyle = {
    fontFamily: 'Public Sans'
}

export default connect(mapStateToProps, { getFollowedAccountsById, getFollowedAccountsByUsername })(FollowedAccounts);
