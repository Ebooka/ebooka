import React, { Component } from 'react'

let documentStyle = {
    backgroundColor: '#F5F5F5', 
    border: 'solid grey 1px',
    marginTop: '25px',
    boxShadow: '5px 5px 5px grey',
    textAlign: 'justify',
    width: '80%',
    marginRight: 'auto',
    marginLeft: 'auto'
}

export class ProfileDraft extends Component {

    editDraft = (id) => {
        window.location.href = `/edit/${id}`;
    }

    stripHTML = (html) => {
        let tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerHTML || '';
    }

    render() {
        const draft = this.props.draftItem;
        let strippedBody = this.stripHTML(draft.body);
        return (
            <div className="col-sm-4">
                <div id="page" style={documentStyle} onClick={() => this.editDraft(draft.id)}>
                    <p><strong>{draft.title}</strong></p>
                    <p>{strippedBody.length > 50 ? strippedBody.substring(0, 50) + '...' : strippedBody}</p>
                    <p>{draft.genre}</p>
                </div>
            </div>
        );
    }
}

export default ProfileDraft;
