import React, { Component } from 'react';
import { connect } from 'react-redux';
import WritingsList from './WritingsList';
import ProfileDraft from './ProfileDraft';
import Followers from './Followers';
import FollowedAccounts from './FollowedAccounts';
import LikedPosts from './LikedPosts';
import { getFavourites } from '../actions/favouritesActions';
import { getWritingsByUsername } from '../actions/writingActions';
import { getDraftsPreview } from '../actions/draftActions';
import { Container, Spinner, Button, Modal, ModalBody, ModalHeader, Alert, Form, FormGroup, Input } from 'reactstrap';
import axios from 'axios';
import '../style/Tabs.css';
import '../style/Profile.css';
import DraftsList from './DraftsList';
import FavouritesList from './FavouriteLists';

const iconPath = process.env.PUBLIC_URL + '/assets/';

class Profile extends Component {

    state = {
        url: '',
        modal: false
    }

    componentDidUpdate(prevProps) {
        if(this.props.auth.user !== prevProps.auth.user) {
            this.props.getWritingsByUsername(this.props.auth.user.username);
            this.props.getDraftsPreview(this.props.auth.user.id);
            this.props.getFavourites(this.props.auth.user.id);
        }
    }

    componentDidMount() {
        const username = window.location.href.split('/profile/')[1];
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile_image/${username}`)
            .then(res => {
                this.setState({ url: res.data.profile_image });
            });
    }

    openContent = (event, tabName) => {
        let tabContent = document.getElementsByClassName('tabcontent');
        let i;
        for(i = 0 ; i < tabContent.length ; i++) {
            tabContent[i].style.display = 'none';
        }
        let tabLinks = document.getElementsByClassName('tablinks');
        for(i = 0 ; i < tabLinks.length ; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(' active', '');
        }
        document.getElementById(tabName).style.display = 'block';
        event.currentTarget.className += ' active';  
    }

    changeValue = (event) => {
        event.preventDefault();
        let previewImg = document.getElementById('preview');
        const imageInput = document.getElementById('profile_image_input');
        const reader = new FileReader();
        reader.readAsDataURL(imageInput.files[0]);
        reader.onloadend = () => {
            previewImg.src = reader.result;
        }
    }

    saveProfilePicture = (event) => {
        event.preventDefault();
        const imageInput = document.getElementById('profile_image_input');
        const reader = new FileReader();
        reader.readAsDataURL(imageInput.files[0]);
        reader.onloadend = () => {
            axios.post(`${process.env.REACT_APP_API_URL}/api/users/profile_image/${this.props.auth.user.username}`, { 
                userImage: reader.result
            });
            this.setState({ url: reader.result });
            this.toggle();
        }
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    render() {
        if(this.props.auth.user) {
            let { username, followed_users, liked_posts, followers, id } = this.props.auth.user;
            let { writings } = this.props.writing;
            let { drafts } = this.props.draft;
            let { favs } = this.props.favs;
            return (
                <div style={{position: 'fixed', top: 90, width: '100%', overflowY: 'scroll', height: '90%'}}>
                    <div style={{border: 'solid 1px black', textAlign: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url(${iconPath}bg.jpg)`}}>
                        <div className="img-wrapper" style={{marginTop: 30}}>
                            <img src={this.state.url} alt="Like" style={{ height: 100, width: 100}} id="profile-image"/>
                            <Button onClick={this.toggle} className="btn" style={{backgroundColor: 'white', height: 35, width: 35}}>
                                <img src={`${iconPath}picture.png`} height="25" width="25"/>
                            </Button>
                        </div>
                        <Modal isOpen={this.state.modal} toggle={this.toggle} style={{display: 'block', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', width: 400}}>
                            <ModalHeader toggle={this.toggle}>Elegí tu nueva foto</ModalHeader>
                            <ModalBody style={{textAlign: 'center'}}>
                                {this.state.msg ? (
                                    <Alert color="danger">{this.state.msg}</Alert>
                                ) : null}
                                <Form onSubmit={this.saveProfilePicture}>
                                    <FormGroup>
                                        <label for="profile_image_input" class="btn btn-outline-info" style={{fontFamily: 'Public Sans', fontSize: 15}}>Subir foto</label>
                                        <Input type="file" name="profile_image_input" id="profile_image_input" onChange={this.changeValue} style={{display: 'none'}}/> 
                                    </FormGroup>
                                    <div style={{border: '1px solid #DADADA', textAlign: 'center'}}>
                                        <img src="" alt="Vista previa" id="preview" height="400" width="300"/>
                                    </div>
                                    <button className="btn btn-outline-success" type="submit" style={{marginLeft: 10, marginTop: 30}}>Guardar</button>
                                    <button className="btn btn-outline-danger" type="button" onClick={this.toggle} style={{marginTop: 30}}>Cancelar</button>
                                </Form>
                            </ModalBody>
                        </Modal>
                        <h4>{username}</h4>
                        <div className="row" style={{width: '60%', marginLeft: 'auto', marginRight: 'auto', marginTop: '30px'}}>
                            <div className="col-sm col-6" style={{padding: 0, textAlign: 'center'}}>
                                <p style={sansStyle}>Escritos</p>
                                <p style={sansStyle}>{writings ? writings.length : 0}</p>
                            </div>
                            <div className="col-sm col-6" style={{padding: 0, textAlign: 'center'}}>
                                <p style={sansStyle}>Borradores</p>
                                <p style={sansStyle}>{drafts ? drafts.length : 0}</p>
                            </div>
                            <Followers followers={followers} userId={id}/>
                            <FollowedAccounts followedUsers={followed_users} userId={id}/>
                            <LikedPosts liked_posts={liked_posts} userId={id}/>
                        </div>
                    </div>
                    <Container style={{width: '60%'}}>
                        <div class="tab" style={{display: 'flex'}}>
                            <button className="tablinks" style={{width: 'max-content'}} onClick={event => this.openContent(event, 'writings')}>Escritos Publicados</button>
                            <button className="tablinks" style={{width: 'max-content'}} onClick={event => this.openContent(event, 'drafts')}>Borradores</button>
                            <button className="tablinks" style={{width: 'max-content'}} onClick={event => this.openContent(event, 'favs')}>Biblioteca</button>
                        </div>
                        <div id="writings" className="tabcontent">
                            {writings && writings.length > 0 ? <WritingsList filteredWritings={writings} expanded={false}/> : <p style={{fontFamily: 'Public Sans'}}>No hay escritos publicados aún</p>}
                        </div>
                        <div id="drafts" className="tabcontent container" style={{textAlign: 'center', marginBottom: 10}}>
                            <div className="row" id="drafts-row" style={{textAlign: 'center'}}>
                                {drafts && drafts.length > 0 ? <DraftsList drafts={drafts}/> : <p style={{fontFamily: 'Public Sans'}}>No hay borradores en este momento</p>}
                            </div>
                        </div>
                        <div id="favs" className="tabcontent container">
                            {favs && favs.length > 0 ? <FavouritesList favs={favs}/> : <p style={{fontFamily: 'Public Sans'}}>No hay escritos en tu biblioteca aún</p>}
                        </div>
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
    draft: state.draft,
    favs: state.favs
});

const sansStyle = {
    fontFamily: 'Public Sans'
}

export default connect(mapStateToProps, { getWritingsByUsername, getDraftsPreview, getFavourites })(Profile);
