import React, { Component } from 'react';
import { connect } from 'react-redux';
import WritingsList from './WritingsList';
import Followers from './Followers';
import FollowedAccounts from './FollowedAccounts';
import { getWritingsByUsername } from '../actions/writingActions';
import { getUser, follow, unfollow, block } from '../actions/userActions';
import { Container, Spinner, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import axios from 'axios';
import ModalFooter from 'reactstrap/lib/ModalFooter';
import {MoreHorizOutlined} from "@material-ui/icons";

const iconPath = process.env.PUBLIC_URL + '/assets/';

class User extends Component {

    state = {
        isBlockModalOpen: false,
        isConfirmationModalOpen: false
    }

    componentDidMount() {
        const username = window.location.href.split('/user/')[1];
        this.props.getUser(username);        
    }

    componentDidUpdate(prevProps) {
        const username = window.location.href.split('/user/')[1];
        if(this.props.auth.user !== prevProps.auth.user && this.props.auth.user.username === username) {
                window.location.href = `/profile/${username}`;
        }
        if(this.props.user !== prevProps.user) {
            axios.get(`/api/users/profile_image/${username}`)
            .then(res => {
                let image = document.getElementById('profile-image');
                image.src = res.data.profile_image;
            });
            this.props.getWritingsByUsername(username);
        }
    }

    toggleFollow = (event) => {
        event.preventDefault();
        let { followers } = this.props.user;
        let followersElement = document.getElementById('followers');
        if(followers && followers.includes(this.props.auth.user.id)) {
            followersElement.innerHTML = parseInt(followersElement.innerHTML) - 1;
            this.props.unfollow(this.props.user.username, this.props.auth.user.id);
        } else {
            followersElement.innerHTML = parseInt(followersElement.innerHTML) + 1;
            this.props.follow(this.props.user.username, this.props.auth.user.id);
        }
    }

    followButton = () => {
        let { followers } = this.props.user;
        return ( <Button style={{marginBottom: 20, backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}} onClick={this.toggleFollow}>{followers && followers.includes(this.props.auth.user.id) ? 'Dejar de seguir' : 'Seguir'}</Button> );
    }

    toggleConfirmBlockModal = () => {
        this.setState({ 
            isBlockModalOpen: false,
            isConfirmationModalOpen: !this.state.isConfirmationModalOpen
         });
    }

    toggleBlockModal = () => {
        this.setState({ isBlockModalOpen: !this.state.isBlockModalOpen });
    }

    confirmBlock = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.block(this.props.auth.user.id, this.props.user.id);
        window.location.href = '/';
    }

    blockButton = () => {
        return ( 
            <>
                <Button style={{marginBottom: 20, marginLeft: 10, backgroundColor: 'transparent', padding: 0}} onClick={this.toggleBlockModal}>
                    {/*<img src="/assets/more-dots.png" width="30" height="30"/>*/}
                    <MoreHorizOutlined />
                </Button>
                <Modal isOpen={this.state.isBlockModalOpen} toggle={this.toggleBlockModal} style={{position: 'fixed', top: '25%', left: '50%', transform: 'translate(-50%, 0)', width: 400}}>
                    <ModalBody style={{textAlign: 'center'}}>
                        <a href="#" onClick={this.toggleConfirmBlockModal} style={{color: 'red'}}><strong>{`Bloquear a ${this.props.user.username}`}</strong></a>
                    </ModalBody>
                    <ModalFooter style={{textAlign: 'center', display: 'block'}}>
                        <a href="#" onClick={this.toggleBlockModal}>Cancelar</a>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.isConfirmationModalOpen} toggle={this.toggleConfirmBlockModal}>
                    <ModalHeader>{`¿Estás seguro que deseas bloquear a ${this.props.user.username}?`}</ModalHeader>
                    <ModalBody>
                        <p>No te preocupes, puedes desbloquear a un usuario en cualquier momento desde tu configuración.</p>
                        <Button color="danger" onClick={this.confirmBlock}>Bloquear</Button>
                        <Button color="secondary" onClick={this.toggleConfirmBlockModal}>Cancelar</Button>
                    </ModalBody>
                </Modal>
            </>
        );
    }

    render() {
        if(this.props.user) {
            let { username, followed_users, followers } = this.props.user;
            let { writings } = this.props.writing;
            return (
                <div style={{position: 'fixed', top: 90, width: '100%'}}>
                    <div style={{textAlign: 'center'}}>
                        <div id="top-section" style={{display: 'flex', marginLeft: 'auto', marginRight: 'auto', width: 'max-content'}}>
                            <div className="img-wrapper" style={{marginTop: 30, marginLeft: 0, marginRight: 0}}>
                                <img src="" alt="profile-image" style={{ height: 100, width: 100}} id="profile-image"/>
                            </div>
                            <div id="actions" style={{marginTop: '1.5rem', marginLeft: '1rem'}}>
                                {this.props.auth.user ? <h3>{username}</h3> : <h3 style={{marginTop: '2rem'}}>{username}</h3>}
                                {this.props.auth.user ? this.followButton() : null}
                                {this.props.auth.user ? this.blockButton() : null}
                            </div>
                        </div>
                        <hr/>
                        <div className="row" style={{width: '60%', marginLeft: 'auto', marginRight: 'auto', marginTop: '30px'}}>
                            <div className="col-sm" style={{padding: 0, textAlign: 'center', cursor:'pointer'}}>
                                <p style={sansStyle}>Escritos</p>
                                <p style={sansStyle}>{writings ? writings.length : 0}</p>
                            </div>
                            <Followers followers={followers} username={username}/>
                            <FollowedAccounts followedUsers={followed_users} username={username}/>
                        </div>
                        <hr/>
                    </div>
                    <Container style={{width: '60%', overflowY: 'scroll'}}>
                        <h5 style={{marginLeft: 40}}>Escritos publicados</h5>
                        {writings ? <WritingsList filteredWritings={writings} expanded={false}/> : <p>No hay escritos publicados aún</p>}
                    </Container>
                </div>
            );
        } else {
            return (
                <Container style={{textAlign: 'center'}}>
                    <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
                </Container>
            )
        }
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    writing: state.writing,
    user: state.user.user
});

const sansStyle = {
    fontFamily: 'Public Sans'
}

export default connect(mapStateToProps, { getWritingsByUsername, getUser, follow, unfollow, block })(User);
