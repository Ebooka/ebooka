import React, { Component } from 'react'
import Button from 'reactstrap/lib/Button';
import {connect} from 'react-redux';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';
import Alert from 'reactstrap/lib/Alert';

const notificationTypes = ['Likes', 'Comentarios', 'Etiquetas de comentarios', 'Seguidores nuevos'];

class NotificationsList extends Component {

    state = {
        likes_switch: true,
        comments_switch: true,
        tags_switch: true,
        follows_switch: true,
        checked: false
    }

    componentDidMount() {
        if(this.props.auth.user && !this.state.checked) {
            this.setState({
                checked: true,
                likes_switch: this.props.auth.user.likes_notif_active,
                comments_switch: this.props.auth.user.comments_notif_active,
                tags_switch: this.props.auth.user.tags_notif_active,
                follows_switch: this.props.auth.user.follows_notif_active,
            });
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.checked
        });
    } 

    saveState = event => {
        event.preventDefault();
        event.stopPropagation();
        const body = {
            userId: this.props.auth.user.id,
            likes_notif_active: this.state.likes_switch,
            comments_notif_active: this.state.comments_switch,
            tags_notif_active: this.state.tags_switch,
            follows_notif_active: this.state.follows_switch,
        };
        axios.post(`${process.env.REACT_APP_API_URL}/api/users/update-notifications`, body)
            .then(res => {
                document.getElementById('alert').style.display = 'block';
            });
    }

    render() {
        return (
            <div>        
                <p style={{fontSize: 20, fontFamily: 'Public Sans'}}>Likes</p>
                <Switch checked={this.state.likes_switch} onChange={this.onChange} name="likes_switch"></Switch>
                <hr/>
                <p style={{fontSize: 20, fontFamily: 'Public Sans'}}>Comentarios</p>
                <Switch checked={this.state.comments_switch} onChange={this.onChange} name="comments_switch"></Switch>
                <hr/>
                <p style={{fontSize: 20, fontFamily: 'Public Sans'}}>Etiquetas</p>
                <Switch checked={this.state.tags_switch} onChange={this.onChange} name="tags_switch"></Switch>
                <hr/>
                <p style={{fontSize: 20, fontFamily: 'Public Sans'}}>Nuevos seguidores</p>
                <Switch checked={this.state.follows_switch} onChange={this.onChange} name="follows_switch"></Switch>
                <hr/>
                <Button onClick={this.saveState}>Guardar</Button>
                <Alert color="success" id="alert" style={{display: 'none', marginTop: 20}}>Notificaciones actualizadas con éxito!</Alert>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(NotificationsList);
