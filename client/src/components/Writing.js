import React, { Component } from 'react';
import { Jumbotron, 
         Button, 
         Badge,
         ButtonGroup, 
         Spinner, 
         FormGroup, 
         Form, 
         Input, 
         Dropdown, 
         DropdownToggle,
         DropdownMenu, 
         DropdownItem,
         ModalHeader,
         ModalBody,
         Modal,
         ModalFooter } from 'reactstrap';
import { genres } from '../static/genres';
import '../style/Writing.css'
import { connect } from 'react-redux';
import {likeWriting, unlikeWriting, saveComment, deleteWriting, getWritingLikers} from '../actions/writingActions';
import { follow, unfollow, block, addToFavourites, removeFromFavourites } from '../actions/userActions';
import { createTagNotification } from '../actions/notificationActions';
import axios from 'axios';
import Login from './auth/Login';
import Register from './auth/Register';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import Comment from './Comment';
import CommentResponseInput from "./CommentResponseInput";
import {Card} from "@material-ui/core";
import LikersModal from "./LikersModal";
import {
    AddCircleOutlineOutlined, BlockOutlined,
    BookmarkBorderOutlined,
    CommentOutlined, DeleteOutlineOutlined,
    ExpandMoreOutlined,
    ForwardOutlined, OutlinedFlagOutlined, PersonAddOutlined,
    Visibility,
    VisibilityOutlined
} from "@material-ui/icons";

const iconPath = process.env.PUBLIC_URL + '/assets/';
const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

class Writing extends Component {

    state = {
        commentToggled: false,
        lastComments: null,
        lastCommentsLikes: null,
        lastCommentsResponses: null,
        commentContent: '',
        previewLimit: (this.props.expanded ? 500 : 250),
        previewLimitModal: 500,
        toggle: false,
        followedUsers: this.props.auth.user ? this.props.auth.user.followed_users : [],
        followText: this.props.auth.user && this.props.auth.user.followed_users && this.props.auth.user.followed_users.includes(this.props.current.id) ? 
                                                                `Dejar de seguir a ${this.props.current.username}` : 
                                                                `Seguir a ${this.props.current.username}`,
        saveText: this.props.auth.user && this.props.auth.user.favourites && this.props.auth.user.favourites.includes(this.props.current.id) ? 'Eliminar de biblioteca' : 'Guardar en biblioteca',
        toggleReadMore: false,
        imageURL: '/assets/user.png',
        deleteToggle: false,
        forceLogin: false,
        confirmBlockModalIsOpen: false,
        oldCommentTagged: '',
        shareModalIsOpen: false,
        type: '',
        newCommentTriggered: false,
        newCommentContent: '',
        loading: false,
        likersModalIsOpen: false,
    }

    componentDidMount() {
        axios.get(`/api/users/profile_image/${this.props.current.username}`)
            .then(res => {
                this.setState({ imageURL: res.data.profile_image })
                let image = document.getElementById(`user-image-${this.props.current.id}`);
                if(image)
                    image.src = res.data.profile_image;
            })
            .catch(err => console.log(err));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.newCommentLoading !== this.props.newCommentLoading &&
            !this.props.newCommentLoading &&
            !this.props.newCommentError) {
            // username, content, c.id, c.likes, c.responses, profile_image
            console.log(this.props.auth);
            const newCommentComplete = {
                ...this.props.newComment,
                username: this.props.auth.user.username,
                profile_image: this.props.auth.user.profile_image,
            }
            if(this.state.lastComments) {
                this.setState({lastComments: [...this.state.lastComments, newCommentComplete]});
            } else {
                this.setState({lastComments: [newCommentComplete]});
            }
        }
    }

    getAllComments = (writingId) => {
        this.setState({ loading: true });
        axios.get(`/api/writings/all-comments/${writingId}/`)
            .then(res => {
                let likesPerComment = [];
                let responsesPerComment = [];
                const comments = res.data;
                for(let i = 0 ; i < res.data.length ; i++) {
                    likesPerComment.push(comments[i].likes);
                    responsesPerComment.push(comments[i].responses);
                }
                this.setState({
                    loading: false,
                    lastComments: res.data,
                    lastCommentsLikes: likesPerComment,
                    lastCommentsResponses: responsesPerComment
                });

            })
            .catch(error => this.setState({
                lastComments: [],
                loading: false
            }));
    }

    isAlphaNum = code => {
        return ((code > 47 && code < 58) || (code > 64 && code < 91) || (code > 96 && code < 123))
    }

    preventEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let commentTrimmed = this.state.commentContent.trim();    
        if(commentTrimmed.length > 0) {
            //let oldComment = document.getElementById(`old-comment-empty${this.props.current.id}`);
            //if(oldComment && oldComment.innerText && oldComment.innerText === 'No hay comentarios aún, se el primero!')
            //    oldComment.style.display = 'none'
            //let commentAmount = document.getElementById(`comments-amount${this.props.current.id}`);
            //commentAmount.innerHTML = parseInt(commentAmount.innerHTML) + 1;
            //document.getElementById(`new-comment${this.props.current.id}`).style.display = 'flex';
            /*let commentUsername = document.getElementById(`new-commenter-username${this.props.current.id}`);
            commentUsername.innerHTML = this.props.auth.user.username;
            commentUsername.href = `/user/${this.props.auth.user.username}`;*/
            if(commentTrimmed.includes('@')) {
                let indexes = [], trueTaggedAccountsIndexes = [];
                let accounts = [];
                let idx;
                let startIdx = 0;
                while((idx = commentTrimmed.indexOf('@', startIdx)) > -1) {
                    indexes.push(idx);
                    startIdx = idx + 1;
                }
                let tagNumber = 0;
                indexes.forEach((idx) => {
                    accounts[tagNumber] = '';
                    for(let i = idx + 1 ; commentTrimmed.charAt(i) && this.isAlphaNum(commentTrimmed.charCodeAt(i)) ; i++) {
                        accounts[tagNumber] += commentTrimmed.charAt(i);
                    }
                    if(accounts[tagNumber] !== '') {
                        trueTaggedAccountsIndexes.push(idx);
                        tagNumber++;
                    }
                })
                if(tagNumber > 0) {
                    let newCommentTrimmed = '';
                    for(let i = 0 ; i < commentTrimmed.length ; i++) {
                        if(trueTaggedAccountsIndexes.includes(i)) {
                            const tag = trueTaggedAccountsIndexes.indexOf(i);
                            newCommentTrimmed += `<a href="/user/${accounts[tag]}">@${accounts[tag]}</a>`;
                            i += accounts[tag].length;
                        } else {
                            newCommentTrimmed += commentTrimmed.charAt(i);
                        }
                    }
                    commentTrimmed = newCommentTrimmed;
                    for(let i = 0 ; i < trueTaggedAccountsIndexes.length ; i++) {
                        this.props.createTagNotification(this.props.auth.user.id, accounts[i], this.props.current.id);
                    }   
                }
            }
            this.setState({ commentContent: '' });
            this.props.saveComment(this.props.current.id, commentTrimmed, this.props.auth.user.id);
            /*if(prevCommentMsg)
                prevCommentMsg.style.display = 'none';*/
        }
    }

    commentTyped = (event) => {
        this.setState({
            commentContent: event.target.value
        });
    }

    commentPressed = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(!this.state.commentToggled) {
            this.setState({
                commentToggled: !this.state.commentToggled,
            });
            this.getAllComments(this.props.current.id);
        }
    }

    likePressed = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let current = this.props.current;
        let likeButton = document.getElementById(`like-icon${this.props.current.id}`);
        let likeAmountString = document.getElementById(`like-amount${this.props.current.id}`);
        let id = this.props.auth.user.id;
        if(!current.likes || !current.likes.includes(id)) {
            likeButton.src = `${iconPath}like-full.png`;
            likeAmountString.innerHTML = parseInt(likeAmountString.innerHTML) + 1;
            this.props.likeWriting(current.id, this.props.auth.user.id);
        } else if(current.likes && current.likes.includes(id)){
            likeButton.src = `${iconPath}like-empty.png`;
            likeAmountString.innerHTML = parseInt(likeAmountString.innerHTML) - 1;
            this.props.unlikeWriting(current.id, this.props.auth.user.id);
        }
    }

    copyLinkToClipboard = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let dummyInput = document.createElement('textarea');
        dummyInput.value = window.location.href + 'read/' + this.props.current.id;
        document.body.appendChild(dummyInput);
        dummyInput.select();
        dummyInput.focus();
        document.execCommand('copy');
        document.body.removeChild(dummyInput);
        let alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert dismissible fade show';
        alertDiv.id = `alert-${this.props.current.id}`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerText = 'El enlace se ha guardado en el portapapeles!';
        let button = document.createElement('button');
        button.className = 'close';
        button.setAttribute('type', 'button');
        button.setAttribute('data-dismiss', 'alert');
        button.setAttribute('aria-label', 'Close');
        let span = document.createElement('span');
        span.innerHTML = '&times;';
        span.setAttribute('aria-hidden', 'true');
        button.appendChild(span);
        alertDiv.appendChild(button);
        let jumbotron = document.getElementById(`main${this.props.current.id}`);
        jumbotron.appendChild(alertDiv);
        this.toggleShareModal(event);
    }

    getWritingLikers = id => {
        this.props.getWritingLikers(id);
        this.setState({ likersModalIsOpen: true });
    }

    interactionButtons = (id, likes) => (
        <div style={{textAlign: 'center', zIndex: 1000}} id="interactions">
            <hr className="my-2"></hr>
            <ButtonGroup size="sm" style={{width: '100%'}}>
                <button className="btn" type="button" id="like-button" style={{border: 'none'}}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}
                          onClick={() => this.getWritingLikers(this.props.current.id)}
                          id={`like-amount${this.props.current.id}`}>
                        {`${this.props.current.likes ? this.props.current.likes.length : 0} me gusta`}
                    </span>
                    <img id={`like-icon${this.props.current.id}`}
                         src={`${iconPath}${likes && likes.includes(id) ? 'like-full.png' : 'like-empty.png'}`}
                         alt="Like"
                         style={{ height: 23, width: 23, margin: '0 0.3rem'}}
                         onClick={this.likePressed}/>
                </button>
                <button className="btn" type="button" id="comment-button" style={{border: 'none'}} onClick={this.commentPressed}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}} id={`comments-amount${this.props.current.id}`}>{this.props.current.comments ? this.props.current.comments.length : 0}</span>
                    {/*<img src={`${iconPath}comment.png`} alt="Comments" style={{ height: 20, width: 20, margin: '0 0.3rem' }}/>*/}
                    <CommentOutlined />
                </button>
                <button className="btn" type="button" id="views-button" style={{border: 'none', cursor: 'default'}}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.viewsCount()}</span>
                    {/*<img src={`${iconPath}views.png`} alt=".png" style={{ height: 23, width: 23, margin: '0 0.3rem'}}/>*/}
                    <VisibilityOutlined />
                </button>
                <button className="btn" type="button" id="share-button" style={{border: 'none'}} onClick={this.toggleShareModal}>
                    {/*<img src={`${iconPath}share.png`} alt="Like" style={{ height: 20, width: 20}}/>*/}
                    <ForwardOutlined />
                </button>
            </ButtonGroup>
            <hr className="my-2"></hr>
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

    dummyButtons = () => (
        <div style={{textAlign: 'center', zIndex: 1000}} id="interactions">
            <hr className="my-2"></hr>
            <ButtonGroup size="sm"style={{width: '100%'}}>
                <button className="btn" id="like-button" type="button" style={{border: 'none'}} onClick={event => this.forceLogin(event, 'like')}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.props.current.likes ? this.props.current.likes.length : 0}</span>
                    <img id="like-icon" src="/assets/like-empty.png" alt="Like" style={{ height: 23, width: 23, margin: '0 0.3rem' }}/>
                </button>
                <button className="btn" id="comment-button" type="button" style={{border: 'none'}} onClick={this.commentPressed}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.props.current.comments ? this.props.current.comments.length : 0}</span>
                    {/*<img src="/assets/comment.png" alt="Comment" style={{ height: 20, width: 20, margin: '0 0.3rem' }}/>*/}
                    <CommentOutlined />
                </button>
                <button className="btn" id="views-button" type="button" style={{border: 'none', cursor: 'default'}}>
                    <span style={{color: '#5D5C5C', fontSize: '0.9rem'}}>{this.viewsCount()}</span>
                    {/*<img src={`${iconPath}views.png`} alt="Views" style={{ height: 23, width: 23, margin: '0 0.3rem'}}/>*/}
                    <VisibilityOutlined />
                </button>
                <button className="btn" id="share-button" type="button" style={{border: 'none'}} onClick={event => this.forceLogin(event, 'share')}>
                    {/*<img src="/assets/share.png" alt="Share" style={{ height: 20, width: 20, margin: '0 0.3rem' }}/>*/}
                    <ForwardOutlined />
                </button>
            </ButtonGroup>
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

    stripHTML = (html) => {
        let tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerHTML || '';
    }

    toggle = () => {
        this.setState({toggle: !this.state.toggle});
    }

    readMore = (event) => {
        event.preventDefault();
        window.location.href = `/read/${this.props.current.id}`;
    }

    follow = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const current = this.props.current;
        let copy = this.state.followedUsers ?? [];
        let followText = document.getElementById(`follow-p${current.id}`);
        if(this.state.followedUsers?.includes(current.writer_id)) {
            const index = this.state.followedUsers.indexOf(current.writer_id);
            copy.splice(index, 1);
            followText.innerText = `Seguir a ${current.username}`;
            this.setState({ followText: `Seguir a ${current.username}` });
            this.props.unfollow(current.username, this.props.auth.user.id);
        } else {
            copy.push(current.writer_id);
            followText.innerText = `Dejar de seguir a ${current.username}`;
            this.setState({ followText: `Dejar de seguir a ${current.username}` });
            this.props.follow(current.username, this.props.auth.user.id);
        }  
        this.setState({ followedUsers: copy});
    }

    report = (event) => {
        event.preventDefault();        
    }

    delete = (event) => {
        event.preventDefault();
        document.getElementById(`main${this.props.current.id}`).style.display = 'none';
        this.deleteToggle(event);        
        this.props.deleteWriting(this.props.current.id);
    }


    save = (event) => {
        event.preventDefault();
        const favs = this.props.auth.user.favourites;
        if(favs.includes(this.props.current.id)) {
            this.setState({ saveText: 'Guardar en biblioteca' });
            this.props.removeFromFavourites(this.props.auth.user.id, this.props.current.id);        
        } else {
            this.setState({ saveText: 'Eliminar de biblioteca' });
            this.props.addToFavourites(this.props.auth.user.id, this.props.current.id);        
        }
    }

    edit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = `/edit/${this.props.current.id}?writing`;
    }

    expandWriting = (event) => {
        if(event.target.name !== 'username') {
            event.preventDefault();
            const body = this.stripHTML(this.props.current.body);
            const description = this.props.current.description;
            if(description || description.length > 0) {
                this.toggleReadMore();
            } else if(body.length < this.state.previewLimit) {
                window.location.href = `/read/${this.props.current.id}`;
            } else {
                this.toggleReadMore();
            }
        }
    }

    toggleReadMore = () => {
        this.setState({ 
            toggleReadMore: !this.state.toggleReadMore,
        });
    }

    viewsCount = () => {
        const viewers = this.props.current.viewers;
        const anonViewers = this.props.current.anon_viewers;
        let viewersCount = 0;
        let anonViewersCount = 0;
        if(viewers)
            viewersCount = viewers.length;
        if(anonViewers)
            anonViewersCount = anonViewers.length;
        return viewersCount + anonViewersCount;
    }

    deleteToggle = (event) => {
        event.preventDefault();
        this.setState({deleteToggle: !this.state.deleteToggle});
    }

    selectContent = (modal) => {
        let current = this.props.current;
        if(!current.description || current.description === '') {
            let strippedBody = this.stripHTML(current.body);
            const needsPreview = !modal ? (strippedBody.length > this.state.previewLimit ? true : false) : (strippedBody.length > this.state.previewLimitModal ? true : false);
            return needsPreview ? strippedBody.substring(0, !modal ? this.state.previewLimit : this.state.previewLimitModal) + '...' : strippedBody
        } else {
            if(!modal && current.description.length < this.state.previewLimit) {
                return current.description;
            } else if(modal && current.description.length < this.state.previewLimit) {
                const strippedBody = this.stripHTML(current.body);
                const needsPreview = !modal ? (strippedBody.length > this.state.previewLimit ? true : false) : (strippedBody.length > this.state.previewLimitModal ? true : false);
                return needsPreview ? strippedBody.substring(0, this.state.previewLimitModal) + '...' : strippedBody
            } else if(!modal && current.description.length > this.state.previewLimit) {
                return current.description.substring(0, this.state.previewLimit) + '...';
            } else {
                return current.description.substring(0, this.state.previewLimitModal) + '...';
            }
        }
    }

    needsReadMore = (modal) => {
        // si tiene descripcion e incompleta ==> mostrame mas descripcion
        // si la descripcion ya la lei completa, dame un poco de texto
        // si no tiene descripcion, idem 
        let current = this.props.current;
        if(!current.description || current.description === '') {
            let strippedBody = this.stripHTML(current.body);
            const needsPreview = !modal ? (strippedBody.length > this.state.previewLimit ? true : false) : (strippedBody.length > this.state.previewLimitModal ? true : false);
            return needsPreview ? <a color="primary" id="read-more" onClick={this.toggleReadMore}><strong>Leer más</strong></a> : <br/>
        } else {
            const needsPreview = !modal ? (current.description.length > this.state.previewLimit ? true : false) : (current.description.length > this.state.previewLimitModal ? true : false);
            return needsPreview ? <a color="primary" id="read-more" onClick={this.toggleReadMore}><strong>Leer más</strong></a> : <br/>
        }   
    }

    needsReadAll = (modal) => {
        let current = this.props.current;
        if(!current.description || current.description === '') {
            let strippedBody = this.stripHTML(current.body);
            const needsPreview = !modal ? (strippedBody.length > this.state.previewLimit ? true : false) : (strippedBody.length > this.state.previewLimitModal ? true : false);
            return needsPreview ? <a href={`/read/${current.id}`} style={{color: '#3B52A5'}}><strong>Leer todo</strong></a> : <br/>
        } else {
            return <a color="#3B52A5" href={`/read/${current.id}`} style={{color: '#3B52A5'}}><strong>Leer todo</strong></a>;
        }
    }

    toggleConfirmBlockModal = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ confirmBlockModalIsOpen: !this.state.confirmBlockModalIsOpen });
    }

    block = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.block(this.props.auth.user.id, this.props.current.writer_id);
        this.setState({ confirmBlockModalIsOpen: false });
        document.getElementById(`main${this.props.current.id}`).style.display = 'none';
    }

    triggerNewComment = content => {
        this.setState({
            newCommentTriggered: true,
            newCommentContent: content
        });
    }

    toggleShareModal = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ shareModalIsOpen: !this.state.shareModalIsOpen })
    }

    toggleLikersModal = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ likersModalIsOpen: !this.state.likersModalIsOpen })
    }

    parseDate = () => {
        let completeDate = this.props.current.last_edited;
        let onlyDate = completeDate.split('T')[0];
        let yearMonthDay = onlyDate.split('-');
        const year = yearMonthDay[0];
        const month = yearMonthDay[1];
        const day = yearMonthDay[2];
        const currentYear = new Date().getFullYear();
        if(year < currentYear)
            return `${day} de ${months[month - 1]} del ${year}`;
        else
            return `${day} de ${months[month - 1]}`;
    }

    handleDelete = () => {
        this.getAllComments(this.props.current.id);
    }

    render() {
        const { isAuthenticated, user, isAdmin } = this.props.auth;
        let current = this.props.current;
        if(current) {
            let color = '';
            genres.forEach(genreObject => {
                if(genreObject.genre === current.genre) {
                    color = genreObject.color;
                }
            });
            return (
                <div id={`main${this.props.current.id}`}>
                <Card style={{padding: 10, marginBottom: 10, backgroundColor: 'white', cursor: 'pointer'}}>
                    <div id="top-bar" style={{display: 'flex'}}>
                        <div id="text-content" style={this.props.current.cover && this.props.expanded ? {display: 'flex', flexDirection: 'column', marginLeft: 15, width: '100%'} : {display: 'flex', flexDirection: 'column', width: '100%'}}>
                            <div id="header" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <h2 className="display-5">{current.title}</h2>
                                <Dropdown isOpen={this.state.toggle} toggle={this.toggle}>
                                    <DropdownToggle nav>
                                        {/*<img src="/assets/expand.png" width="20" height="20"/>*/}
                                        <ExpandMoreOutlined />
                                    </DropdownToggle>
                                    <DropdownMenu right className={'my-dropdown-menu'}>
                                        {
                                            this.props.auth.user && this.props.auth.user.username !== current.username ? 
                                                <DropdownItem onClick={this.follow}>
                                                    <div id="follow-option" className="writing-item">
                                                        {/*<img src="/assets/follow.png" width="25" height="25"/>*/}
                                                        <PersonAddOutlined />
                                                        <p id={`follow-p${current.id}`}>{this.state.followText}</p>
                                                    </div>
                                                </DropdownItem> :
                                                null
                                        }
                                        { this.props.auth.user ?
                                            <DropdownItem onClick={this.save}>
                                                <div id="save-option" className="writing-item">
                                                    {/*<img src="/assets/bookmark.png" width="25" height="25"/>*/}
                                                    <BookmarkBorderOutlined />
                                                    <p id={`save-p${current.id}`}>{this.state.saveText}</p>
                                                </div>
                                            </DropdownItem>
                                            : null
                                        }
                                        <DropdownItem onClick={this.readMore}>
                                            <div id="expand-option" className="writing-item">
                                                {/*<img src="/assets/more.png" width="25" height="25"/>*/}
                                                <AddCircleOutlineOutlined />
                                                <p>Ver más</p>
                                            </div>
                                        </DropdownItem>
                                        {
                                            this.props.auth.user && this.props.auth.user.username !== current.username ?
                                            <DropdownItem onClick={this.report}>
                                                <div id="report-option" className="writing-item">
                                                    {/*<img src="/assets/white-flag.png" width="25" height="25"/>*/}
                                                    <OutlinedFlagOutlined />
                                                    <p>Reportar</p>
                                                </div>
                                            </DropdownItem>
                                            : null
                                        }
                                        {
                                            this.props.auth.user && this.props.auth.user.username !== current.username ?
                                            <>
                                                <DropdownItem onClick={this.toggleConfirmBlockModal}>
                                                    <div id="block-option" className="writing-item">
                                                        {/*<img src="/assets/block.png" width="25" height="25"/>*/}
                                                        <BlockOutlined />
                                                        <p>{`Bloquear a ${current.username}`}</p>
                                                    </div>
                                                </DropdownItem>
                                                <Modal isOpen={this.state.confirmBlockModalIsOpen} toggle={this.toggleConfirmBlockModal}>
                                                    <ModalHeader>{`¿Estás seguro que deseas bloquear a ${current.username}?`}</ModalHeader>
                                                    <ModalBody>
                                                        <p>No te preocupes, puedes desbloquear a un usuario en cualquier momento desde tu configuración.</p>
                                                        <Button color="danger" onClick={this.block}>Bloquear</Button>
                                                        <Button color="secondary" onClick={this.toggleConfirmBlockModal}>Cancelar</Button>
                                                    </ModalBody>
                                                </Modal>
                                            </> :
                                            null
                                        }
                                        {
                                            this.props.auth.user && this.props.auth.user.username === current.username ? 
                                                <DropdownItem id="edit-option" onClick={this.edit}>
                                                    <div id="edit-option" className="writing-item">
                                                        <img src="/assets/edit.png" width="25" height="25"/>  
                                                        <p>Editar</p>
                                                    </div>
                                                </DropdownItem> :
                                                null
                                        }
                                        {
                                            this.props.auth.user && this.props.auth.user.username === current.username ? 
                                                <DropdownItem id="delete-dropdown-item" onClick={this.deleteToggle}>
                                                    <div id="delete-option" className="writing-item">
                                                        {/*<img src="/assets/bin.png" width="25" height="25" alt={'bin'}/>*/}
                                                        <DeleteOutlineOutlined />
                                                        <p>Eliminar</p>
                                                    </div>
                                                </DropdownItem> :
                                                null
                                        }
                                    </DropdownMenu >
                                </Dropdown>
                            </div>
                            <div>
                                <h4 className="lead" style={{fontSize: '1.45rem'}}>{this.selectContent(false)}</h4>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div className="clickable-container" onClick={this.expandWriting}>
                            {this.needsReadMore(false)}
                            <hr className="my-2"/>
                            <div style={{verticalAlign: 'middle', padding: 5, display: 'flex',  zIndex: 1000}}>
                                <div className="img-wrapper-writing">
                                    <img src="" alt="Photo" height="50" width="50" id={`user-image-${current.id}`}/>
                                </div>
                                <div style={{display: 'flex'}}>
                                    <a href={`/user/${current.username}`} name="username" style={{paddingLeft: 10, paddingTop: 10}}> {current.username}</a>
                                </div>
                            </div>
                            <Badge key={current.id} style={{ backgroundColor: color, color: 'white', marginBottom: 10}}><strong>{current.genre}</strong></Badge>
                            <p style={{fontFamily: 'Public Sans', fontSize: 12}}>{this.parseDate()}</p>
                        </div>
                        { isAuthenticated && !isAdmin ? this.interactionButtons(user.id, current.likes) : this.dummyButtons() }
                        { this.state.loading &&
                            <div style={{marginLeft: 'auto', marginRight: 'auto', textAlign: 'center'}}>
                                <Spinner size={'sm'}/>
                            </div>
                        }
                        { this.state.lastComments ? this.state.lastComments.length > 0 ?
                            this.state.lastComments.map(comment => (
                            <Comment responses={comment.responses ? comment.responses : []}
                                     likes={comment.likes ? comment.likes : []}
                                     writingId={current.id}
                                     commentId={comment.id}
                                     image={comment.profile_image}
                                     auth={this.props.auth}
                                     username={comment.username}
                                     content={comment.content}
                                     depth={0}
                                     onDelete={this.handleDelete}
                            />
                        )) : <p style={{fontFamily: 'Public Sans'}}>¡No hay comentarios todavía! Sé el primero en añadir uno.</p> : null}
                        { this.state.commentToggled &&
                            <CommentResponseInput  writingId={current.id}
                                                   commentId={null}
                                                   depth={0}
                                                   trigger={this.triggerNewComment}
                                                   auth={this.props.auth}/>
                        }
                    </div>
                </Card>
                <Modal isOpen={this.state.toggleReadMore} toggle={this.toggleReadMore} style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', width: '50%'}}>
                    <ModalHeader toggle={this.toggleReadMore}>{current.title}</ModalHeader>
                    <ModalBody>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            { this.props.current.cover ? 
                                <div id="optional-cover" style={{height: 'auto', width: '45%', border: '1px solid #D3D3D3'}}>
                                    <img src={this.props.current.cover} style={{height: '100%', width: '100%'}}/> 
                                </div> 
                                : null
                            }
                            <div style={this.props.current.cover ? {width: '60%'} : {width: '100%'}}>
                                <h4 className="lead" style={{fontSize: '16px', marginLeft: 10}}>{this.selectContent(true)}</h4>
                            </div>
                        </div>
                        <br/>
                        {this.needsReadAll(true)}
                        <hr className="my-2"/>
                        <div style={{verticalAlign: 'middle', padding: 5, display: 'flex'}}>
                            <div className="img-wrapper-writing">
                                <img src={this.state.imageURL} alt="Photo" height="50" width="50" id={`user-image-${current.id}`}/>
                            </div>
                            <a href={`/user/${current.username}`} style={{paddingLeft: 10, paddingTop: 10}}> {current.username}</a>
                        </div>
                        <Badge key={current.id} style={{ backgroundColor: color, color: 'white', marginBottom: 10}}><strong>{current.genre}</strong></Badge>
                        { isAuthenticated && !isAdmin ? this.interactionButtons(user.id, current.likes) : null }
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.deleteToggle} toggle={this.deleteToggle} style={{position: 'fixed', top: '25%', left: '50%', transform: 'translate(-50%, 0)'}}>
                    <ModalHeader toggle={this.deleteToggle}>Eliminar escrito</ModalHeader>
                    <ModalBody>
                        <h6>¿Estás seguro que deseas eliminar el escrito?</h6>
                        <p style={{fontFamily: 'Public Sans'}}>El escrito no será recuperable luego de ser eliminado</p>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button className="btn" onClick={this.delete} style={{marginRight: 10, backgroundColor: '#EC1009', borderColor: '#EC1009', color: 'white'}}>Eliminar</Button>
                            <Button className="btn btn-secondary" onClick={this.deleteToggle}>Cancelar</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.shareModalIsOpen} toggle={this.toggleShareModal}>
                    <ModalHeader toggle={this.toggleShareModal}>Compartir escrito</ModalHeader>
                    <ModalBody id="modal-share-body">
                        <FacebookShareButton url={'http://escritos-app.herokuapp.com/read/' + this.props.current.id}>
                             <p className="fa fa-facebook" style={{fontSize: 25}}></p>
                        </FacebookShareButton>
                        <TwitterShareButton url={'http://escritos-app.herokuapp.com/read/' + this.props.current.id}>
                            <p className="fa fa-twitter" style={{fontSize: 25}}></p>
                        </TwitterShareButton>
                        <WhatsappShareButton url={'http://escritos-app.herokuapp.com/read/' + this.props.current.id}>
                            <p className="fa fa-whatsapp" style={{fontSize: 24}}></p>
                        </WhatsappShareButton>
                        <div onClick={this.copyLinkToClipboard} id="copy-link">
                            <p className="fa fa-link"></p>
                        </div>
                    </ModalBody>
                </Modal>
                <LikersModal isOpen={this.state.likersModalIsOpen}
                             likes={this.props.likers}
                             loading={this.props.loadingLikers}
                             toggle={this.toggleLikersModal}/>
                </div>
            );
        } else {
            return (<img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>)
        }
    };
}

const mapStateToProps = state => ({
    auth: state.auth,
    newComment: state.writing.newComment,
    newCommentLoading: state.writing.commentedWritingLoading,
    newCommentError: state.writing.newCommentError,
    loadingLikers: state.writing.loadingLikers,
    likers: state.writing.likers
});

export default connect(mapStateToProps, { likeWriting, unlikeWriting, saveComment, follow, unfollow, deleteWriting, block, createTagNotification, addToFavourites, removeFromFavourites, getWritingLikers })(Writing);
