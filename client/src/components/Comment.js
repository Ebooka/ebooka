import React, { Component } from 'react';
import { connect } from 'react-redux';
import { likeComment, saveResponse, saveComment, unlikeComment } from '../actions/writingActions';
import axios from 'axios';
import CommentResponseInput from "./CommentResponseInput";
import { Modal, ModalHeader, ModalBody} from 'reactstrap';
import '../style/Comments.css';

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
        likedByMyself: false
    }

    componentDidMount() {
        this.setState({likes: this.props.likes, responses: this.props.responses});
        if(this.props.auth.user)
            this.setState({likedByMyself: this.props.likes.includes(this.props.auth.user.id)});
    }

    likeComment = (event) => {
        let currentLikes = this.state.likes;
        if(!this.state.likedByMyself) {
            currentLikes.push(this.props.auth.user.id);
            this.props.likeComment(this.props.commentId, this.props.auth.user.id);
            this.setState({likedByMyself: true, likes: currentLikes});
        } else {
            const idx = currentLikes.indexOf(this.props.auth.id);
            currentLikes.splice(idx, 1);
            this.props.unlikeComment(this.props.commentId, this.props.auth.user.id);
            this.setState({likedByMyself: false, likes: currentLikes});
        }
    }

    commentTyped = (event) => {
        this.setState({
            commentContent: event.target.value
        });
    }

    getResponses = event => {
        axios.get(`/api/writings/responses/${this.props.commentId}`)
            .then(res => {
                console.log(res.data);
                this.setState({
                    responses: res.data
                });
            });
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
            const targetComment = document.getElementById(`comment-div-${this.props.commentId}`);
            const newComment = document.createElement('div');
            const newCommentBubble = document.createElement('div');
            const newCommentUserImage = document.createElement('img');
            const newCommentInner = document.createElement('div');
            const newCommentUserA = document.createElement('a');
            const newCommentContent = document.createElement('p');
            newComment.style.width = '96%';
            newComment.style.marginLeft = '2.5rem';
            newComment.style.marginTop = '1rem';
            newComment.style.marginBottom = '1rem';
            newComment.style.borderRadius = '5px';
            newCommentBubble.style.display = 'flex';
            newCommentUserImage.src = this.props.auth.user.profile_image;
            newCommentUserImage.width = '35';
            newCommentUserImage.height = '35';
            newCommentUserImage.style.border = '1px solid black';
            newCommentUserImage.style.borderRadius = '50%';
            newCommentInner.style.marginLeft = '10px';
            newCommentInner.style.border = '1px solid #E9ECEF';
            newCommentInner.style.borderRadius = '5px';
            newCommentInner.style.width = '100%';
            newCommentInner.style.backgroundColor = '#E9ECEF';
            newCommentUserA.style.fontFamily = 'Public Sans';
            newCommentUserA.innerText = this.props.auth.user.username;
            newCommentUserA.href = `/user/${this.props.auth.user.username}`;
            newCommentContent.innerText = commentTrimmed;
            newCommentContent.style.marginBottom = '0px';
            newCommentContent.style.fontFamily = 'Public Sans';
            newCommentInner.appendChild(newCommentUserA);
            newCommentInner.appendChild(newCommentContent);
            newCommentBubble.appendChild(newCommentUserImage);
            newCommentBubble.appendChild(newCommentInner);
            newComment.appendChild(newCommentBubble);
            targetComment.removeChild(document.getElementById(`new-response-${this.props.writingId}-${this.props.commentId}`));
            targetComment.appendChild(newComment);
            this.setState({ commentContent: '' });   
            this.props.saveResponse(this.props.writingId, commentTrimmed, this.props.commentId, this.props.auth.user.id, null);
        
        }
    }

    triggerNewResponse = (content) => {
        this.setState({
            newCommentContent: content,
            newCommentId: this.props.commentId
        });
    }

    triggerLikes = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({likesModalIsOpen: !this.state.likesModalIsOpen});
        axios.get(`/api/writings/comment/likers/${this.props.commentId}`)
            .then(res => this.setState({ likes: res.data }));
    }

    triggerMoreOptions = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({optionsModalIsOpen: !this.state.optionsModalIsOpen});    
    }

    render() {
        console.log(this.props.likes, this.props.writingId);
        const { user } = this.props.auth;
        const widthValue = 100 - (this.props.depth ? this.props.depth > 2 ? 2 : this.props.depth : 0) * 3;
        return (
            <>
                <div id={`comment-div-${this.props.commentId}`} style={{width: `${widthValue}%`, margin: '3px 0px 3px auto'}}>
                    <div id={`comment-bubble-${this.props.commentId}`} style={{display: 'flex'}}>
                        <img id={`comment-image-${this.props.commentId}`} src={this.props.image} width="35" height="35" style={{border: '1px solid black', borderRadius: '50%'}}/>
                        <div id={`comment-inner-${this.props.commentId}`} style={{marginLeft: 10, border: 'solid 1px #E9ECEF', borderRadius: 5, width: '100%', backgroundColor: '#E9ECEF'}}>
                            <a href={`/user/${this.props.username}`} id={`commenter-username-${this.props.commentId}`} style={{fontFamily: 'Public Sans'}}>{this.props.username}</a>
                            <p id={`comment-content-${this.props.commentId}`} style={{marginBottom: 0, fontFamily: 'Public Sans'}}>{this.props.content}</p>
                        </div>
                    </div>
                    <div id={`comment-full-bubble-${this.props.commentId}`} style={{display: 'flex'}}>
                        <div id={`comment-actions-bubble-${this.props.commentId}`} style={{marginLeft: '2rem'}}>
                            { user ? <a style={{marginLeft: 10, cursor: 'pointer', fontSize: 12}} id={`alike-${this.props.commentId}`} onClick={this.likeComment}>{this.state.likedByMyself ? 'No me gusta más' : 'Me gusta' }</a> : null }
                            { user ? <a style={{marginLeft: 15, cursor: 'pointer', fontSize: 12}} onClick={this.createResponseInput}>Responder</a> : null }
                            { this.props.responses && this.props.responses.length > 0 ? <a id={`aresponses-${this.props.commentId}`} style={{marginLeft: 15, fontSize: 12, cursor: 'pointer'}} onClick={this.getResponses}>{`Ver respuestas (${this.props.responses.length})`}</a> : null}
                        </div>
                        { user && 
                            <div id={`comment-icons-bubble-${this.props.commentId}`} style={{display: 'flex', flexDirection: 'row', marginLeft: 'auto', marginRight: 0,  border: '1px solid #DADADA', borderRadius: 20, padding: 3, boxShadow: '1px 1px #DADADA'}}>
                                <div className={'clickable'} onClick={this.triggerLikes}>
                                    <span style={{fontFamily: 'Public Sans', marginRight: 5, fontSize: 15}}>{this.state.likes.length}</span>
                                    <img src="/assets/like-comment.png" width="15" height="15" style={{marginRight: 5}}/>
                                </div>
                                <div>
                                    <span style={{fontFamily: 'Public Sans'}} style={{marginRight: 5, fontSize: 15}}>{this.state.responses.length}</span>
                                    <img src="/assets/speech-bubble.png" width="15" height="15"/>
                                </div>
                                <div className={'clickable'} onClick={this.triggerMoreOptions}>
                                    <img src="/assets/more-dots.png" width="15" height="15" style={{marginLeft: 5}} id={'in-comment-options'}/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                { this.state.newCommentContent ? <Comment likeComment={this.props.likeComment}
                                                          saveResponse={this.props.saveResponse}
                                                          username={user.username}
                                                          auth={this.props.auth}
                                                          writingId={this.props.writingId}
                                                          commentId={this.state.newCommentId}
                                                          content={this.state.newCommentContent}
                                                          image={user.profile_image}
                                                          likes={[]}
                                                          responses={[]}
                                                          depth={0}
                    />
                    : null }
                { this.state.wantsToRespond ? <CommentResponseInput writingId={this.props.writingId}
                                                                    auth={this.props.auth}
                                                                    commentId={this.props.commentId}
                                                                    trigger={this.triggerNewResponse}
                                                                    depth={this.props.depth ? this.props.depth : 0}/>
                : null }
                {
                    this.state.responses && this.state.responses.length > 0 ?
                    this.state.responses.map((response, idx) => {
                        return <Comment likeComment={this.props.likeComment}
                                        saveResponse={this.props.saveResponse}
                                        username={response.username}
                                        auth={this.props.auth}
                                        writingId={this.props.writingId}
                                        commentId={response.id}
                                        content={response.content}
                                        image={response.profile_image}
                                        idx={this.props.idx + idx}
                                        likes={response.likes ? response.likes : []}
                                        responses={response.responses ? response.responses : []}
                                        depth={this.props.depth + 1}/>;
                    }) : null
                }
                <Modal toggle={this.triggerLikes} isOpen={this.state.likesModalIsOpen} style={{width: '70%',  position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%,0)'}}>
                    <ModalBody>
                        {   
                            this.state.likes.length > 0 &&
                            this.state.likes.map(like => {
                                return (
                                    <div>
                                        {like.username}
                                    </div>
                                );
                            })
                        }
                        {
                            this.state.likes.length === 0 &&
                                <p style={{fontFamily: 'Public Sans'}}>¡A nadie le ha gustado este comentario aún! Se el primero.</p>
                        }
                    </ModalBody>
                </Modal>
                <Modal toggle={this.triggerMoreOptions} isOpen={this.state.optionsModalIsOpen} style={{width: '70%',  position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%,0)'}}>
                    <ModalBody style={{textAlign: 'center', display: 'flex', flexDirection: 'column', padding: 0}}>
                        { user && user.username === this.props.username && <button style={{color: 'red', backgroundColor: 'inherit', width: '100%', border: 'none', borderBottom: 'solid 1px #EDEDED', height: 60}}><b>Eliminar</b></button> }
                        { user && user.username !== this.props.username && <button style={{color: 'red', backgroundColor: 'inherit', width: '100%', border: 'none', borderBottom: 'solid 1px #EDEDED', height: 60}}><b>Reportar</b></button> }
                        <button style={{color: 'gray', backgroundColor: 'inherit', width: '100%', border: 'none', borderBottom: 'solid 1px #EDEDED', height: 60}} onClick={this.triggerMoreOptions}>Cancelar</button>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {likeComment, saveResponse, saveComment, unlikeComment})(Comment);
