import React, { Component } from 'react'
import { connect } from 'react-redux';
import { follow, unfollow } from '../actions/userActions';
import '../style/Notification.css'

const fontStyle = {
    fontFamily: 'Public Sans',
    margin: 0,
}

const dateStyle = {
    fontFamily: 'Public Sans',
    fontSize: 10,
    marginBottom: 5
}

class Notification extends Component {

    state = {
        followButtonText: this.props.notifications ? this.props.notification.followed_users.includes(this.props.notification.id) ? 'Dejar de seguir' : 'Seguir' : null,
        followedUsers: this.props.notification.followed_users
    }

    formatDate = date => {
        const year = date.substring(0,4);
        const month = date.substring(5,7);
        const day = date.substring(8,10);
        return `${day}/${month}/${year}`;
    }

    follow = event => {
        event.preventDefault();
        event.stopPropagation();
        const { id, username } = this.props.notification;
        const followButton = document.getElementById('follow-button');
        let copy = this.state.followedUsers;
        if(this.state.followedUsers.includes(id)) {
            followButton.innerText = 'Seguir';
            const index = this.state.followedUsers.indexOf(id);
            copy.splice(index, 1);
            this.setState({ followButtonText: 'Seguir' });
            this.props.unfollow(id, username, this.props.auth.user.id);
        } else {
            copy.push(id);
            followButton.innerText = 'Dejar de seguir';
            this.setState({ followButtonText: 'Dejar de seguir' });
            this.props.follow(id, username, this.props.auth.user.id);
        }
        this.setState({ followedUsers: copy });
    }

    writeMessage = (type, username) => {
        switch(type) {
            case 'FOLLOW':
                const { followed_users, id } = this.props.notification;
                return (<div style={{display: 'flex', alignItems: 'center'}} >
                            <p style={fontStyle}><a href={`/user/${username}`} style={fontStyle}>{username}</a> ha comenzado a seguirte</p>
                            <button className="btn btn-primary" id="follow-button" style={{marginLeft: 30, padding: 7, zIndex: 10}} onClick={this.follow}>{this.state.followButtonText}</button>
                        </div>);
            case 'LIKE':
                return (<p style={fontStyle}>A <a href={`/user/${username}`} style={{...fontStyle, color: '#3B52A5', fontWeight: 'bolder'}}>{username}</a> le ha gustado tu escrito</p>);
            case 'COMMENT':
                return (<p style={fontStyle}><a href={`/user/${username}`} style={{...fontStyle, color: '#3B52A5', fontWeight: 'bolder'}}>{username}</a> ha comentado tu escrito</p>);
            case 'WRITING':
                return (<p style={fontStyle}><a href={`/user/${username}`} style={{...fontStyle, color: '#3B52A5', fontWeight: 'bolder'}}>{username}</a> ha publicado un escrito nuevo</p>);
            case 'TAG':
                return (<p style={fontStyle}><a href={`/user/${username}`} style={{...fontStyle, color: '#3B52A5', fontWeight: 'bolder'}}>{username}</a> te ha etiquetado en un comentario</p>);
            default:
                return null;
        }
    }
    redirect = (event) => {
        event.preventDefault();
        const { type, post_id } = this.props.notification;
        switch(type) {    
            case 'LIKE':
            case 'COMMENT':
            case 'WRITING':
            case 'TAG':
                window.location.href = `/read/${post_id}`;
                break;
            default:
                return null;
        }
    }

    render() {
        const { username, profile_image, created_at, type } = this.props.notification;
        const formattedDate = this.formatDate(created_at);
        return (
            <div id="notification-div" style={{display: 'flex', flexWrap: 'wrap', cursor: 'pointer', alignItems: 'center'}}>
                <img src={profile_image} width="30" height="30" style={{marginRight: 5}}/>
                <div style={{display: 'flex', flexDirection: 'column'}} onClick={this.redirect}>
                    {this.writeMessage(type, username)}
                    <p style={dateStyle}>{formattedDate}</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { follow, unfollow })(Notification);

