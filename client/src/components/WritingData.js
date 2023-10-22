import React, { Component } from 'react';
import { ButtonGroup, Button, FormGroup, Form, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Login from './auth/Login';
import Register from './auth/Register';
import Comment from './Comment';
import { connect } from 'react-redux';
import Spinner from 'reactstrap/lib/Spinner';
import axios from 'axios';
import {CommentOutlined, ForwardOutlined, Visibility, VisibilityOutlined} from '@material-ui/icons';
import CommentResponseInput from "./CommentResponseInput";
import {getWritingLikers, likeWriting, saveComment, unlikeWriting} from "../actions/writingActions";
import LikersModal from "./LikersModal";
import ShareModal from "./ShareModal";
import CommentSection from './CommentSection';

const iconPath = process.env.PUBLIC_URL + '/assets/';

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
        type: '',
        commentsLoading: false,
        likersModalIsOpen: false,
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
        this.setState({commentsLoading: true});
        axios.get(`${process.env.REACT_APP_API_URL}/api/writings/all-comments/${writingId}`)
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
                    lastCommentsResponses: responsesPerComment,
                    commentsLoading: false,
                });

            })
            .catch(error => this.setState({
                lastComments: []
            }));
    }

    getWritingLikers = id => {
        this.props.getWritingLikers(id);
        this.setState({ likersModalIsOpen: true });
    }

    likePressed = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(this.props.loading) return;
        let current = this.props.data;
        let likeButton = document.getElementById(`like-icon${current.id}`);
        let likeAmountString = document.getElementById(`like-amount${current.id}`);
        let id = this.props.auth.user.id;
        if(!current.likes || !current.likes.includes(id)) {
            likeButton.src = `${iconPath}like-full.png`;
            likeAmountString.innerHTML = parseInt(likeAmountString.innerHTML) + 1;
            this.props.likeWriting(current.id, id);
        } else if(current.likes && current.likes.includes(id)){
            likeButton.src = `${iconPath}like-empty.png`;
            likeAmountString.innerHTML = parseInt(likeAmountString.innerHTML) - 1;
            this.props.unlikeWriting(current.id, id);
        }
    }

    interactionButtons = (id) => (
        <div style={{textAlign: 'center', zIndex: 1000}} id="interactions">
            <hr className="my-2"/>
            <ButtonGroup size="sm" style={{width: '100%'}}>
                <button className="btn" type="button" id="like-button" style={{border: 'none'}}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}
                          onClick={() => this.getWritingLikers(this.props.data.id)}
                          id={`like-amount${this.props.data.id}`}>
                        {`${this.props.data.likes ? this.props.data.likes.length : 0} me gusta`}
                    </span>
                    <img id={`like-icon${this.props.data.id}`}
                         src={`${iconPath}${this.props.data.likes && this.props.data.likes.includes(id) ? 'like-full.png' : 'like-empty.png'}`}
                         alt="Like"
                         style={{ height: 23, width: 23, margin: '0 0.3rem'}}
                         onClick={this.likePressed}/>
                </button>
                <button className="btn" type="button" id="comment-button" style={{border: 'none'}} onClick={this.commentPressed}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}} id={`comments-amount${this.props.data.id}`}>{this.props.data.comments ? this.props.data.comments.length : 0}</span>
                    <CommentOutlined />
                </button>
                <button className="btn" type="button" id="views-button" style={{border: 'none', cursor: 'default'}}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.viewsCount()}</span>
                    <VisibilityOutlined />
                </button>
                <button className="btn" type="button" id="share-button" style={{border: 'none'}} onClick={this.toggleShareModal}>
                    <ForwardOutlined size={'lg'}/>
                </button>
            </ButtonGroup>
            <hr className="my-2"/>

            <div id={`toggle-comment-area${this.props.data.id}`} style={{display: 'none', textAlign: 'left', margin: 5}}>
                {
                    this.state.commentToggled &&
                        <CommentSection writing={this.props.data}
                                        hasComments={this.props.data.comments?.length > 0}
                                        trigger={this.preventEnter}
                        />
                    /*this.state.lastComments.map((comment, idx) =>
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
                    )*/
                }
                {/*<div id={`new-comment${this.props.data.id}`} style={{display: 'none', marginLeft: 'auto', marginRight: 'auto', margin: 5, zIndex: 10}}>
                    <img id={`new-commenter-profile-image${this.props.data.id}`} src="" width="35" height="35" style={{border: '1px solid black', borderRadius: '50%'}} alt={'alt'}/>
                    <div id="comment-bubble" style={{marginLeft: 10, backgroundColor: '#E9ECEF', border: 'solid 1px #E0ECEF', borderRadius: 5, width: '100%'}}>
                        <a href="#" id={`new-commenter-username${this.props.data.id}`} style={{fontFamily: 'Public Sans'}}/>
                        <p id={`new-comment-content${this.props.data.id}`} style={{marginBottom: 0, fontFamily: 'Public Sans'}}/>
                    </div>
                </div>
                <Form id={`comment-form${this.props.data.id}`} onSubmit={this.preventEnter}>
                    <FormGroup>
                        <Input type="text" name={`comment${this.props.data.id}`} id={`comment${this.props.data.id}`} placeholder="Dejá tu comentario aquí" onChange={this.commentTyped} />
                    </FormGroup>
                </Form>*/}
            </div>
        </div>
    );

    dummyButtons = () => (
        <div style={{textAlign: 'center', zIndex: 1000}} id="interactions">
            <hr className="my-2"/>
            <ButtonGroup size="sm"style={{width: '100%'}}>
                <button className="btn" id="like-button" type="button" style={{border: 'none'}} onClick={event => this.forceLogin(event, 'like')}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.props.data.likes ? this.props.data.likes.length : 0}</span>
                    <img id="like-icon" src="/assets/like-empty.png" alt="Like" style={{ height: 23, width: 23, margin: '0 0.3rem' }}/>
                </button>
                <button className="btn" id="comment-button" type="button" style={{border: 'none'}} onClick={this.commentPressed}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.props.data.comments ? this.props.data.comments.length : 0}</span>
                    <CommentOutlined />
                </button>
                <button className="btn" id="views-button" type="button" style={{border: 'none', cursor: 'default'}}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.viewsCount()}</span>
                    <VisibilityOutlined />
                </button>
                <button className="btn" id="share-button" type="button" style={{border: 'none'}} onClick={event => this.forceLogin(event, 'share')}>
                    <ForwardOutlined />
                </button>
            </ButtonGroup>
            <div id={`toggle-comment-area${this.props.data.id}`} style={{display: 'none', textAlign: 'left', margin: 5}}>
                <div id="comment-root"/>
            </div>
            <Modal isOpen={this.state.forceLogin} toggle={this.forceLogin} style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', overflowY: 'scroll', maxHeight: '85%'}}>
                    <ModalHeader>{`Para ${this.state.type}, creá tu cuenta o ingresá`}</ModalHeader>
                    <ModalBody>¡Iniciá sesión para seguir descubriendo contenido!</ModalBody>
                    <ModalFooter>
                        <Button className="btn btn-light btn-outline-dark" style={{padding: 0}}><Login/></Button>
                        <Button className="btn btn-light btn-outline-dark" style={{padding: 0}}><Register/></Button>
                        <Button className="btn btn-light btn-outline-dark" onClick={this.forceLogin}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
        </div>
    );

    toggleShareModal = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ shareModalIsOpen: !this.state.shareModalIsOpen })
    }

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

    commentPressed = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(!this.state.commentToggled) {
            this.setState({
                commentToggled: !this.state.commentToggled,
            });
            //this.getAllComments(this.props.data.id);
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
                    {this.props.auth.user ? this.interactionButtons(this.props.auth.user.id) : this.dummyButtons()}
                    {
                        this.state.lastComments ? this.state.lastComments.length > 0 ?
                        this.state.lastComments.map(comment => (
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
                        ))
                        : <p>¡No hay comentarios todavía! Sé el primero en añadir uno.</p>
                        : null
                    }
                    {
                        this.state.commentsLoading &&
                            <Spinner size={'sm'} color={'black'}>{''}</Spinner>
                    }
                    { this.state.commentToggled &&
                        <CommentResponseInput  writingId={this.props.data.id}
                                               commentId={null}
                                               depth={0}
                                               parents={[]}
                                               trigger={() => this.getAllComments(this.props.data.id)}
                                               auth={this.props.auth}/>
                    }
                    <ShareModal isOpen={this.state.shareModalIsOpen}
                                toggleShareModal={() => this.setState({shareModalIsOpen: !this.state.shareModalIsOpen})}
                                currentId={this.props.data.id}
                    />
                    <LikersModal isOpen={this.state.likersModalIsOpen}
                                 toggle={() => this.setState({likersModalIsOpen: !this.state.likersModalIsOpen})}
                                 likes={this.props.likers}
                                 loading={this.props.loadingLikers}
                    />
                </div>
            );
        } else {
            return <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
        }
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    loadingLikers: state.writing.loadingLikers,
    likers: state.writing.likers,
    loading: state.writing.loading,
});

export default connect(mapStateToProps, {saveComment, getWritingLikers, likeWriting, unlikeWriting})(WritingData);
