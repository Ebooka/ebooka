import React, { Component } from 'react';
import { ButtonGroup, Button, FormGroup, Form, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Login from './auth/Login';
import Register from './auth/Register';
import Comment from './Comment';
import { connect } from 'react-redux';
import Spinner from 'reactstrap/lib/Spinner';
import axios from 'axios';
import {CommentOutlined, ForwardOutlined, Visibility, VisibilityOutlined} from '@material-ui/icons';

class WritingData extends Component {

    state = {
        commentToggled: false,
        lastComments: null,
        lastCommentsLikes: null,
        lastCommentsResponses: null,
        commentContent: '',
        toggle: false,
        followedUsers: this.props.auth.user ? this.props.auth.user.followed_users : [],
        followText: '',
        saveText: '',
        toggleReadMore: false,
        imageURL: '/assets/user.png',
        deleteToggle: false,
        forceLogin: false,
        confirmBlockModalIsOpen: false,
        oldCommentTagged: '',
        shareModalIsOpen: false,
        type: ''
    }

    componentDidUpdate(prevProps) {
        if(prevProps.data !== this.props.data && this.props.data) {
            this.setState({
                followText: this.props.auth.user && this.props.auth.user.followed_users && this.props.auth.user.followed_users.includes(this.props.data.id) ? 
                            `Dejar de seguir a ${this.props.data.username}` : 
                            `Seguir a ${this.props.data.username}`,
                saveText: this.props.auth.user && this.props.auth.user.favourites && this.props.auth.user.favourites.includes(this.props.data.id) ? 
                          'Eliminar de biblioteca' :
                          'Guardar en biblioteca',
            })
        }
    }

    getAllComments = (writingId) => {
        axios.get(`/api/writings/all-comments/${writingId}`)
            .then(res => {
                let likesPerComment = [];
                let responsesPerComment = [];
                const comments = res.data;
                for(let i = 0 ; i < res.data.length ; i++) {
                    likesPerComment.push(comments[i].likes);
                    responsesPerComment.push(comments[i].responses);
                }
                this.setState({
                    lastComments: res.data,
                    lastCommentsLikes: likesPerComment,
                    lastCommentsResponses: responsesPerComment
                });

            })
            .catch(error => this.setState({
                lastComments: []
            }));
    }

    interactionButtons = (id) => (
        <div style={{textAlign: 'center', zIndex: 1000}} id="interactions">
            <hr className="my-2"></hr>
            <ButtonGroup size="sm" style={{width: '100%'}}>
                <button className="btn" type="button" id="like-button" style={{border: 'none'}} onClick={this.likePressed}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}} id={`like-amount${this.props.data.id}`}>{this.props.data.likes ? this.props.data.likes.length : 0}</span>
                    <img id={`like-icon${this.props.data.id}`} src={`/assets/${this.props.data.likes && this.props.data.likes.includes(id) ? 'like-full.png' : 'like-empty.png'}`} alt="Like" style={{ height: 23, width: 23, margin: '0 0.3rem'}}/>
                </button>
                <button className="btn" type="button" id="comment-button" style={{border: 'none'}} onClick={this.commentPressed}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}} id={`comments-amount${this.props.data.id}`}>{this.props.data.comments ? this.props.data.comments.length : 0}</span>
                    {/*<img src={`/assets/comment.png`} alt="Comments" style={{ height: 20, width: 20, margin: '0 0.3rem' }}/>*/}
                    <CommentOutlined />
                </button>
                <button className="btn" type="button" id="views-button" style={{border: 'none', cursor: 'default'}}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.viewsCount()}</span>
                    {/*<img src={`/assets/views.png`} alt="Views" style={{ height: 23, width: 23, margin: '0 0.3rem'}}/>*/}
                    <VisibilityOutlined />
                </button>
                <button className="btn" type="button" id="share-button" style={{border: 'none'}} onClick={this.toggleShareModal}>
                    {/*<img src={`/assets/share.png`} alt="Like" style={{ height: 20, width: 20}}/>*/}
                    <ForwardOutlined size={'lg'}/>
                </button>
            </ButtonGroup>
            <hr className="my-2"></hr>

            <div id={`toggle-comment-area${this.props.data.id}`} style={{display: 'none', textAlign: 'left', margin: 5}}>
                {
                    this.state.lastComments && this.state.lastComments.length > 0 &&
                    this.state.lastComments.map((comment, idx) =>
                        <Comment parent={null}
                                 commentId={comment.id}
                                 username={comment.username}
                                 image={comment.profile_image}
                                 content={comment.content}
                                 writingId={this.props.data.id}
                                 idx={idx}
                                 onDelete={this.handleDelete}
                                 likes={this.state.lastCommentsLikes && this.state.lastCommentsLikes[idx] ? this.state.lastCommentsLikes[idx] : []}
                                 responses={this.state.lastCommentsResponses && this.state.lastCommentsResponses[idx] ? this.state.lastCommentsResponses[idx] : []} />
                    )
                }
                <div id={`new-comment${this.props.data.id}`} style={{display: 'none', marginLeft: 'auto', marginRight: 'auto', margin: 5, zIndex: 10}}>
                    <img id={`new-commenter-profile-image${this.props.data.id}`} src="" width="35" height="35" style={{border: '1px solid black', borderRadius: '50%'}}/>
                    <div id="comment-bubble" style={{marginLeft: 10, backgroundColor: '#E9ECEF', border: 'solid 1px #E0ECEF', borderRadius: 5, width: '100%'}}>
                        <a href="#" id={`new-commenter-username${this.props.data.id}`} style={{fontFamily: 'Public Sans'}}></a>
                        <p id={`new-comment-content${this.props.data.id}`} style={{marginBottom: 0, fontFamily: 'Public Sans'}}></p>
                    </div>
                </div>
                <Form id={`comment-form${this.props.data.id}`} onSubmit={this.preventEnter}>
                    <FormGroup>
                        <Input type="text" name={`comment${this.props.data.id}`} id={`comment${this.props.data.id}`} placeholder="Dejá tu comentario aquí" onChange={this.commentTyped} />
                    </FormGroup>
                </Form>
            </div>
        </div>
    );

    dummyButtons = () => (
        <div style={{textAlign: 'center', zIndex: 1000}} id="interactions">
            <hr className="my-2"></hr>
            <ButtonGroup size="sm"style={{width: '100%'}}>
                <button className="btn" id="like-button" type="button" style={{border: 'none'}} onClick={event => this.forceLogin(event, 'like')}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.props.data.likes ? this.props.data.likes.length : 0}</span>
                    <img id="like-icon" src="/assets/like-empty.png" alt="Like" style={{ height: 23, width: 23, margin: '0 0.3rem' }}/>
                </button>
                <button className="btn" id="comment-button" type="button" style={{border: 'none'}} onClick={this.commentPressed}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.props.data.comments ? this.props.data.comments.length : 0}</span>
                    {/*<img src="/assets/comment.png" alt="Comment" style={{ height: 20, width: 20, margin: '0 0.3rem' }}/>*/}
                    <CommentOutlined />
                </button>
                <button className="btn" id="views-button" type="button" style={{border: 'none', cursor: 'default'}}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.viewsCount()}</span>
                    {/*<img src={`/assets/views.png`} alt="Views" style={{ height: 23, width: 23, margin: '0 0.3rem'}}/>*/}
                    <VisibilityOutlined />
                </button>
                <button className="btn" id="share-button" type="button" style={{border: 'none'}} onClick={event => this.forceLogin(event, 'share')}>
                    {/*<img src="/assets/share.png" alt="Share" style={{ height: 20, width: 20, margin: '0 0.3rem' }}/>*/}
                    <ForwardOutlined />
                </button>
            </ButtonGroup>
            <div id={`toggle-comment-area${this.props.data.id}`} style={{display: 'none', textAlign: 'left', margin: 5}}>
                <div id="comment-root"></div>
            </div>
            <Modal isOpen={this.state.forceLogin} toggle={this.forceLogin} style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', overflowY: 'scroll', maxHeight: '85%'}}>
                    <ModalHeader>{`Para ${this.state.type}, creá tu cuenta o ingresá!`}</ModalHeader>
                    <ModalBody>¡Iniciá sesión para seguir descubriendo contenido!</ModalBody>
                    <ModalFooter>
                        <Button className="btn btn-light btn-outline-dark" style={{padding: 0}}><Login/></Button>
                        <Button className="btn btn-light btn-outline-dark" style={{padding: 0}}><Register/></Button>
                        <Button className="btn btn-light btn-outline-dark" onClick={this.forceLogin}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
        </div>
    );

    forceLogin = (event, type) => {
        event.preventDefault();
        event.stopPropagation();
        let action = '';
        if(type === 'like')
            action = 'poner me gusta';
        else if(type === 'share')
            action = 'compartir';
        this.setState({ forceLogin: !this.state.forceLogin, type: action });
    }

    /*getLastComment = () => {
        if(this.state.lastComments === null)
            return (<img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>);
        else if(this.state.lastComments.length === 0) 
            return (<div id={`old-comment-empty${this.props.data.id}`} style={{display: 'flex'}}>
                        <p id={`old-comment-content-empty${this.props.data.id}`} style={{fontFamily: 'Public Sans'}}>No hay comentarios aún, se el primero!</p>
                    </div>);
        else if(!this.props.auth.user) {
            for(let i = 0 ; i < this.state.lastComments.length ; i++) {
                let mainDiv = document.createElement('div');
                mainDiv.setAttribute('id', `old-comment${i}${this.props.data.id}`);
                mainDiv.setAttribute('class', `old-comment${i}${this.props.data.id}-${this.state.lastComments[i].id}`);
                mainDiv.setAttribute('style', "display: flex; margin: 10");
                let img = document.createElement('img');
                img.setAttribute('id', `old-comment-image${i}${this.props.data.id}`);
                img.setAttribute('src', this.state.lastComments[i].profile_image);
                img.setAttribute('width', '35');
                img.setAttribute('height', '35');
                img.setAttribute('style', "border: 1px solid black; border-radius: 50%");
                let userDiv = document.createElement('div');
                userDiv.setAttribute('id', `old-comment${i}${this.props.data.id}`);
                userDiv.setAttribute('style', "margin-left: 10px; border: solid 1px #E9ECEF; border-radius: 5px; width: 100%; background-color: #E9ECEF");
                let userA = document.createElement('a');
                userA.setAttribute('id', `old-commenter-username${i}${this.props.data.id}`);
                userA.setAttribute('href', `/user/${this.state.lastComments[i].username}`);
                userA.innerText = this.state.lastComments[i].username;
                userA.setAttribute('style', "font-family: 'Public Sans'");
                let userP = document.createElement('p');
                userP.setAttribute('id', `old-comment-content${i}${this.props.data.id}`);
                userP.setAttribute('style', "marginBottom: 0px; font-family: 'Public Sans'");
                userP.innerHTML = this.state.lastComments[i].content;
                userDiv.appendChild(userA);
                userDiv.appendChild(userP);
                mainDiv.appendChild(img);
                mainDiv.appendChild(userDiv);
                document.getElementById('comment-root').appendChild(mainDiv);
            }
        }
    }*/

    commentPressed = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(!this.state.commentToggled) {
            this.setState({
                commentToggled: !this.state.commentToggled,
            });
            this.getAllComments(this.props.data.id);
            //document.getElementById(`toggle-comment-area${this.props.data.id}`).style.display = '';
        }
    }

    viewsCount = () => {
        const viewers = this.props.data.viewers;
        const anonViewers = this.props.data.anon_viewers;
        let viewersCount = 0;
        let anonViewersCount = 0;
        if(viewers)
            viewersCount = viewers.length;
        if(anonViewers)
            anonViewersCount = anonViewers.length;
        return viewersCount + anonViewersCount;
    }

    handleDelete = () => {
        this.getAllComments(this.props.current.id);
    }

    render() {
        const data = this.props.data;
        if(data) {
            return (
                <div style={{backgroundColor: 'white', border: '1px solid #DADADA', marginTop: '1rem', height: 'max-content'}}>
                    {this.props.auth.user ? this.interactionButtons() : this.dummyButtons()}
                    {this.state.lastComments ? this.state.lastComments.length > 0 ? this.state.lastComments.map(comment => (
                        <Comment writingId={this.props.data.id}
                                 commentId={comment.id}
                                 auth={this.props.auth}
                                 likes={comment.likes ? comment.likes : []}
                                 responses={comment.responses ? comment.responses : []}
                                 content={comment.content}
                                 image={comment.profile_image}
                                 username={comment.username}
                                 depth={0}
                                 onDelete={this.handleDelete}
                        />
                    )): <p>¡No hay comentarios todavía! Sé el primero en añadir uno.</p> : null}
                </div>
            );
        } else {
            return <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
        }
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(WritingData);

/*{
    "id": 113,
    "title": "Primero del 2021",
    "body": "<p>Feliz año!!!</p>",
    "writer_id": 95,
    "last_edited": "2021-01-09T16:21:54.071Z",
    "genre": "Querido X",
    "tags": [
      "newyear"
    ],
    "comments": null,
    "likes": [
      34
    ],
    "subgenre": null,
    "completed": false,
    "cover": "null",
    "description": "Primer escrito publicado en 2021!",
    "viewers": null,
    "anon_viewers": [
      "b9350683-52c8-4750-b09a-1c50d6cc5168"
    ],
    "chapters": null,
    "username": "eugeniodamm",
    "profile_image": ""
}*/
