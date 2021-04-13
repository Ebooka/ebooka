import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Notification from './Notification';
import { connect } from 'react-redux';
import axios from 'axios';

const toggleStyle = {
    padding: '5px',
    backgroundColor: 'transparent',
    border: 'none',
}

class NotificationDropdown extends Component {

    state = {
        toggle: false,
        opened: false
    }

    componentDidUpdate(prevProps) {
        if(this.props.notifications.length !== prevProps.notifications.length) {
            const initialNotificationsCount = this.props.notifications.length;
            let unreadNotifications = 0;
            for(let i = 0 ; i < initialNotificationsCount ; i++) {
                if(!this.props.notifications[i].read)
                    unreadNotifications++;
            }
            if(unreadNotifications > 0) {
                if(unreadNotifications > 20)
                    document.title = '(20+) - Escritos';
                else
                    document.title = `(${unreadNotifications}) - Escritos`;
            }
        }
    }

    toggle = () => {
        if(!this.state.opened) {
            let icon = document.getElementById('notification-image');
            icon.src = '/assets/notification-empty.png';
            axios.post(`/api/notifications/${this.props.auth.user.id}`);
            this.setState({opened: true});
            document.title = 'Escritos';
        }
        this.setState({
            toggle: !this.state.toggle
        });
    }

    allRead = () => {
        var allRead = true;
        for(let i = 0 ; i < this.props.notifications.length && allRead ; i++) {
            if(!this.props.notifications[i].read)
                allRead = false;
        }
        return allRead;
    }

    render() {
        return (
            <Dropdown isOpen={this.state.toggle} toggle={this.toggle} style={{marginRight: 10}}>
                <DropdownToggle style={toggleStyle}>
                    <img id="notification-image" width="25" src={this.props.notifications.length > 0 && !this.allRead() ? '/assets/notification-full.png' : '/assets/notification-empty.png'} alt="notifications"/>
                </DropdownToggle>
                <DropdownMenu right style={{maxHeight: 300, height: 'auto', overflowX: 'hidden', right: 0}}>
                    {this.props.notifications.length > 0 ? 
                        this.props.notifications.map(notification => (
                            <DropdownItem style={{width: '480px'}}>
                                <Notification notification={notification}/>
                                <hr style={{margin: 0}}/>
                            </DropdownItem>
                        )) :
                        <DropdownItem header>No hay notificaciones sin leer</DropdownItem>    
                    }    
                </DropdownMenu>    
            </Dropdown>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(NotificationDropdown);
