import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {connect} from "react-redux";
import {saveResponse, saveComment} from "../actions/writingActions";

class CommentResponseInput extends Component {

    state = {
        response: '',
    }

    handleChange = event => {
        if(event.target.value && event.target.value !== '')
            this.setState({ response: event.target.value });
    }

    isAlphaNum = code => {
        return ((code > 47 && code < 58) || (code > 64 && code < 91) || (code > 96 && code < 123))
    }

    handleEnter = async event => {
        const { response } = this.state;
        let responseTrimmed = response.trim();
        if(event.key === 'Enter' && responseTrimmed.length > 0) {
            if(responseTrimmed.includes('@')) {
                let indexes = [], trueTaggedAccountsIndexes = [];
                let accounts = [];
                let idx;
                let startIdx = 0;
                while((idx = responseTrimmed.indexOf('@', startIdx)) > -1) {
                    indexes.push(idx);
                    startIdx = idx + 1;
                }
                let tagNumber = 0;
                indexes.forEach((idx) => {
                    accounts[tagNumber] = '';
                    for(let i = idx + 1 ; responseTrimmed.charAt(i) && this.isAlphaNum(responseTrimmed.charCodeAt(i)) ; i++) {
                        accounts[tagNumber] += responseTrimmed.charAt(i);
                    }
                    if(accounts[tagNumber] !== '') {
                        trueTaggedAccountsIndexes.push(idx);
                        tagNumber++;
                    }
                })
                if(tagNumber > 0) {
                    let newCommentTrimmed = '';
                    for(let i = 0 ; i < responseTrimmed.length ; i++) {
                        if(trueTaggedAccountsIndexes.includes(i)) {
                            const tag = trueTaggedAccountsIndexes.indexOf(i);
                            newCommentTrimmed += `<a href="/user/${accounts[tag]}">@${accounts[tag]}</a>`;
                            i += accounts[tag].length;
                        } else {
                            newCommentTrimmed += responseTrimmed.charAt(i);
                        }
                    }
                    responseTrimmed = newCommentTrimmed;
                    for(let i = 0 ; i < trueTaggedAccountsIndexes.length ; i++) {
                        this.props.createTagNotification(this.props.auth.user.id, accounts[i], this.props.current.id);
                    }
                }
            }
            this.setState({ response: '' });
            if(this.props.commentId) {
                this.props.saveResponse(this.props.writingId, responseTrimmed, this.props.commentId, this.props.auth.user.id, this.props.parents);
                this.props.trigger(responseTrimmed);
            } else {
                this.props.saveComment(this.props.writingId, responseTrimmed, this.props.auth.user.id);
                this.props.trigger(responseTrimmed);
            }
        }
    }

    render() {
        const widthValue = 100 - 3 * this.props.depth;
        return (
            <div className={'comment-response'} style={{width: `calc(${widthValue}% - 40px)`, margin: '3px 0px 3px auto'}}>
                <input type={'text'} name={'response'} style={{borderRadius: 10}} onKeyDown={this.handleEnter} onChange={this.handleChange} placeholder={this.props.commentId ? 'Escribí tu respuesta aquí' : 'Escribí tu comentario aquí'} value={this.state.response}/>
            </div>
        )
    }
}

CommentResponseInput.propTypes = {commentId: PropTypes.any};

const mapStateToPropsResponse = state => ({
    writing: state.writing
})

export default connect(mapStateToPropsResponse, { saveResponse, saveComment })(CommentResponseInput);
