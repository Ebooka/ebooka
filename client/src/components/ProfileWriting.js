import React, { Component } from 'react'

let documentStyle = {
    backgroundColor: '#F5F5F5', 
    border: 'solid grey 1px',
    marginTop: '25px',
    boxShadow: '5px 5px 5px grey',
    textAlign: 'justify',
    width: '80%',
    height: 200,
    marginRight: 'auto',
    marginLeft: 'auto'
}

export class ProfileWriting extends Component {

    readWriting = (id) => {
        window.location.href = `/read/${id}`;
    }

    stripHTML = (html) => {
        let tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerHTML || '';
    }


    render() {
        const writing = this.props.id;
        let strippedBody = this.stripHTML(writing.body);
        return (
            <div className="col-sm-4">
                <div id="page" style={documentStyle} onClick={() => this.readWriting(writing.id)}>
                    <p><strong>{writing.title}</strong></p>
                    <p>{strippedBody.length > 50 ? strippedBody.substring(0, 50) + '...' : strippedBody}</p>
                    <p>{writing.genre}</p>
                    <p>Likes: {writing.likes ? writing.likes.length : 0}</p>
                </div>
            </div>
        );
    }
}

export default ProfileWriting;
