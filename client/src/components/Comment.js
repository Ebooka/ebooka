import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    likeComment,
    saveResponse,
    saveComment,
    unlikeComment,
    deleteComment,
    getResponses
} from '../actions/writingActions';
import axios from 'axios';
import CommentResponseInput from "./CommentResponseInput";
import {Modal, ModalBody, Spinner} from 'reactstrap';
import '../style/Comments.css';
import LikeRow from "./LikeRow";
import CommentThread from './CommentThread';

class Comment extends Component {

    state = {
        commentContent: '',
        wantsToRespond: false,
        newCommentContent: null,
        newCommentId: null,
        likesModalIsOpen: false,
        optionsModalIsOpen: false,
        likes: [],
        responses: [],
        likedByMyself: false,
        deleteCommentLoading: false,
        openedResponses: false,
        loading: false,
        newCommentLoading: false,
        requestedResponses: false,
    }

    componentDidMount() {
        this.setState({likes: this.props.current.likes, responses: this.props.current.responses});
        if(this.props.auth.user)
            this.setState({likedByMyself: this.props.current.likes?.includes(this.props.auth.user.id)});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.deleteCommentLoading !== this.props.deleteCommentLoading) {
            this.setState({ deleteCommentLoading: this.props.deleteCommentLoading });
        }
        if(prevProps.deleteCommentLoading !== this.props.deleteCommentLoading &&
            !this.props.deleteCommentLoading && !this.props.deletionError) {
            this.setState({ optionsModalIsOpen: false });
            if(typeof this.props.onDelete === 'function') this.props.onDelete();
        }
        if(prevProps.respondedCommentLoading !== this.props.respondedCommentLoading) {
            this.setState({ newCommentLoading: this.props.respondedCommentLoading });
        }
        if(prevProps.gettingResponsesLoading && !this.props.gettingResponsesLoading && this.state.requestedResponses) {
            this.setState({loading: false, requestedResponses: false});
        }
    }

    likeComment = (event) => {
        let currentLikes = this.state.likes ?? [];
        if(!this.state.likedByMyself) {
            currentLikes.push(this.props.auth.user.id);
            this.props.likeComment(this.props.current.id, this.props.auth.user.id, this.props.writingId, this.props.parents);
            this.setState({likedByMyself: true, likes: currentLikes});
        } else {
            const idx = currentLikes.indexOf(this.props.auth.id);
            currentLikes.splice(idx, 1);
            this.props.unlikeComment(this.props.current.id, this.props.auth.user.id, this.props.writingId, this.props.parents);
            this.setState({likedByMyself: false, likes: currentLikes});
        }
    }

    commentTyped = (event) => {
        this.setState({
            commentContent: event.target.value
        });
    }

    getResponses = event => {
        this.setState({ openedResponses: true, loading: true, requestedResponses: true });
        this.props.getResponses(this.props.current.id, this.props.writingId, [...this.props.parents, this.props.current.id]);
    }

    createResponseInput = event => {
        this.setState({ wantsToRespond: true });
    }

    preventEnter = (event) => {
        let commentTrimmed = this.state.commentContent.trim();    
        if(commentTrimmed.length > 0) {
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
                        this.props.createTagNotification(this.props.auth.user.id, accounts[i], this.props.writingId);
                    }   
                }
            }
            this.setState({ commentContent: '' });   
            this.props.saveResponse(this.props.writingId, commentTrimmed, this.props.current.id, this.props.auth.user.id, [...this.props.parents, this.props.current.id]);
        
        }
    }

    triggerNewResponse = (content) => {
        this.props.trigger && this.props.trigger();
        this.setState({
            newCommentContent: content,
            newCommentId: this.props.current.id,
            wantsToRespond: false,
        });
    }

    triggerLikes = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({likesModalIsOpen: !this.state.likesModalIsOpen});
        axios.get(`/api/writings/comment/likers/${this.props.current.id}`)
            .then(res => this.setState({ likes: res.data }));
    }

    triggerMoreOptions = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({optionsModalIsOpen: !this.state.optionsModalIsOpen});    
    }

    deleteComment = event => {
        event.preventDefault();
        this.props.triggerDelete(this.props.current.responses ? this.props.current.responses.length + 1 : 0);
        this.props.deleteComment(this.props.current.id, this.props.writingId, this.props.parents);
    }

    render() {
        const { user } = this.props.auth;
        const widthValue = 100 - (this.props.depth ? this.props.depth > 2 ? 2 : this.props.depth : 0) * 3;
        return (
            <>
                <div id={`comment-div-${this.props.current.id}`} style={{width: `${widthValue}%`, margin: '3px 0px 3px auto'}}>
                    <div id={`comment-bubble-${this.props.id}`} style={{display: 'flex'}}>
                        <img id={`comment-image-${this.props.current.id}`} src={this.props.current.profile_image} width="35" height="35" style={{border: '1px solid black', borderRadius: '50%'}}/>
                        <div id={`comment-inner-${this.props.current.id}`} style={{marginLeft: 10, border: 'solid 1px #E9ECEF', borderRadius: 5, width: '100%', backgroundColor: '#E9ECEF'}}>
                            <a href={`/user/${this.props.current.username}`} id={`commenter-username-${this.props.current.id}`} style={{fontFamily: 'Public Sans'}}>{this.props.current.username}</a>
                            <p id={`comment-content-${this.props.current.id}`} style={{marginBottom: 0, fontFamily: 'Public Sans'}}>{this.props.current.content}</p>
                        </div>
                    </div>
                    <div id={`comment-full-bubble-${this.props.current.id}`} style={{display: 'flex'}}>
                        <div id={`comment-actions-bubble-${this.props.id}`} style={{marginLeft: '2rem'}}>
                            { user ? <a style={{marginLeft: 10, cursor: 'pointer', fontSize: 12}} id={`alike-${this.props.id}`} onClick={this.likeComment}>{this.state.likedByMyself ? 'No me gusta más' : 'Me gusta' }</a> : null }
                            { user ? <a style={{marginLeft: 15, cursor: 'pointer', fontSize: 12}} onClick={this.createResponseInput}>Responder</a> : null }
                            { this.props.current.responses && this.props.current.responses.length > 0 ? <a id={`aresponses-${this.props.current.id}`} style={{marginLeft: 15, fontSize: 12, cursor: 'pointer'}} onClick={this.getResponses}>{`Ver respuestas (${this.props.current.responses.length})`}</a> : null}
                        </div>
                        { user && 
                            <div id={`comment-icons-bubble-${this.props.current.id}`} style={{display: 'flex', flexDirection: 'row', marginLeft: 'auto', marginRight: 0,  border: '1px solid #DADADA', borderRadius: 20, padding: 3, boxShadow: '1px 1px #DADADA'}}>
                                <div className={'clickable'} onClick={this.triggerLikes}>
                                    <span style={{fontFamily: 'Public Sans', marginRight: 5, fontSize: 15}}>{this.props.current.likes ? this.props.current.likes.length : 0}</span>
                                    <img src="/assets/like-comment.png" width="15" height="15" style={{marginRight: 5}}/>
                                </div>
                                <div>
                                    <span style={{fontFamily: 'Public Sans'}} style={{marginRight: 5, fontSize: 15}}>{this.props.current.responses ? this.props.current.responses.length : 0}</span>
                                    <img src="/assets/speech-bubble.png" width="15" height="15"/>
                                </div>
                                <div className={'clickable'} onClick={this.triggerMoreOptions}>
                                    <img src="/assets/more-dots.png" width="15" height="15" style={{marginLeft: 5}} id={'in-comment-options'}/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {
                    this.state.newCommentContent &&
                    this.state.newCommentLoading &&
                    <div style={{marginLeft: 'auto', marginRight: 'auto', textAlign: 'center'}}>
                        <Spinner color={'dark'} size={'sm'}/>
                    </div>
                }
                {
                    this.state.openedResponses &&
                        <CommentThread
                            comments={this.props.current.responses}
                            loading={this.state.loading}
                            depth={this.props.depth + 1}
                            writingId={this.props.writingId}
                            parents={[...this.props.parents, this.props.current.id]}
                            triggerDelete={this.props.triggerDelete}
                            trigger={this.props.trigger}
                        />
                }
                {   this.state.wantsToRespond &&
                    <CommentResponseInput writingId={this.props.writingId}
                                          auth={this.props.auth}
                                          commentId={this.props.current.id}
                                          trigger={this.triggerNewResponse}
                                          parents={[...this.props.parents, this.props.current.id]}
                                          depth={this.props.depth ? this.props.depth : 0}/>
                }
                {
                    this.state.openedResponses &&
                    this.props.gettingResponsesLoading &&
                    <div style={{marginLeft: 'auto', marginRight: 'auto', textAlign: 'center'}}>
                        <Spinner color={'dark'} size={'sm'}/>
                    </div>
                }
                <Modal toggle={this.triggerLikes} isOpen={this.state.likesModalIsOpen}
                       style={{width: '70%',  position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%,0)'}}>
                    <ModalBody>
                        {   
                            this.props.current.likes?.length > 0 &&
                            this.state.likes.map(like => <LikeRow like={like}/>)
                        }
                        {
                            this.props.current.likes?.length === 0 &&
                                <p style={{fontFamily: 'Public Sans'}}>¡A nadie le ha gustado este comentario aún! Se el primero.</p>
                        }
                    </ModalBody>
                </Modal>
                <Modal toggle={this.triggerMoreOptions} isOpen={this.state.optionsModalIsOpen} style={{width: '70%',  position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%,0)'}}>
                    <ModalBody style={{textAlign: 'center', display: 'flex', flexDirection: 'column', padding: 0}}>
                        { user && user.username === this.props.current.username &&
                            <button style={{color: 'red', backgroundColor: 'inherit', width: '100%', border: 'none', borderBottom: 'solid 1px #EDEDED', height: 60}}
                                    onClick={this.deleteComment}>
                                { this.props.deleteCommentLoading ? <Spinner color={'danger'} size={'sm'}/> : <b>Eliminar</b>}
                            </button>
                        }
                        { user && user.username !== this.props.current.username &&
                            <button style={{color: 'red', backgroundColor: 'inherit', width: '100%', border: 'none', borderBottom: 'solid 1px #EDEDED', height: 60}}><b>Reportar</b></button>
                        }
                        <button style={{color: 'gray', backgroundColor: 'inherit', width: '100%', border: 'none', borderBottom: 'solid 1px #EDEDED', height: 60}} onClick={this.triggerMoreOptions}>Cancelar</button>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    deleteCommentLoading: state.writing.deleteCommentLoading,
    deletionMessage: state.writing.msg,
    deletionError: state.writing.error,
    respondedCommentLoading: state.writing.respondedCommentLoading,
    newCommentResponse: state.writing.newCommentResponse,
    gettingResponsesLoading: state.writing.gettingResponsesLoading,
    gettingResponsesError: state.writing.gettingResponsesError,
});

export default connect(mapStateToProps, {likeComment, saveResponse, saveComment, unlikeComment, deleteComment, getResponses})(Comment);
