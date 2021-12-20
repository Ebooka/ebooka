import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Notification from './Notification';
import { connect } from 'react-redux';
import {Notifications, NotificationsOutlined} from "@material-ui/icons";
import axios from "axios";

const notifStyle = {
    cursor: 'pointer',
    marginTop: 7
}

class NotificationDropdown extends Component {

    state = {
        toggle: false,
        opened: false,
        unread: false,
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
                this.setState({unread: true});
                if(unreadNotifications > 20)
                    document.title = '(20+) - Escritos';
                else
                    document.title = `(${unreadNotifications}) - Escritos`;
            }
        }
    }

    toggle = () => {
        if(!this.state.opened) {
            /*let icon = document.getElementById('notification-image');
            icon.src = '/assets/notification-empty.png';*/
            axios.post(`/api/notifications/${this.props.auth.user.id}`).then(res => {
                this.setState({opened: true});
                document.title = 'Escritos';
            });
        }
        this.setState({
            toggle: !this.state.toggle,
            unread: false,
        });
    }

    render() {
        return (
            <Dropdown isOpen={this.state.toggle} toggle={this.toggle} style={{marginRight: 10}}>
                {/*<DropdownToggle style={toggleStyle}>*/}
                    {/*<img id="notification-image" width="25" src={this.props.notifications.length > 0 && !this.allRead() ? '/assets/notification-full.png' : '/assets/notification-empty.png'} alt="notifications"/>*/}
                    {
                        this.state.unread ?
                            <Notifications color={this.state.bellColor} style={notifStyle} onClick={this.toggle}/> :
                            <NotificationsOutlined color={'black'} style={notifStyle} onClick={this.toggle}/>
                    }
                {/*}</DropdownToggle>*/}
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
