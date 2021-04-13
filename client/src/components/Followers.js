import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { getFollowersByUsername, getFollowersById } from '../actions/userActions';

class Followers extends Component {

    state = {
        modal: false,
    }

    toggle = () => {
        if(!this.state.modal) {
            if(this.props.userId)
                this.props.getFollowersById(this.props.userId);
            else
                this.props.getFollowersByUsername(this.props.username);
        }
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <>
                <div className="col-sm col-6" style={{padding: 0, textAlign: 'center', cursor:'pointer'}} onClick={this.toggle}>
                    <p style={sansStyle}>Seguidores</p>
                    <p style={sansStyle} id="followers">{this.props.followers ? this.props.followers.length : 0}</p>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Seguidores</ModalHeader>
                    <ModalBody>
                        {this.props.accounts ? this.props.accounts.map(follower => (<><a href={`/user/${follower.username}`}>{follower.username}</a><br></br></>)) :
                                                    <p>No te sigue ninguna cuenta todavía.</p>}
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

export default connect(mapStateToProps, { getFollowersByUsername, getFollowersById })(Followers);