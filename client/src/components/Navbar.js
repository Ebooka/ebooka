import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Logout from './auth/Logout';
import Register from './auth/Register';
import Login from './auth/Login';
import NotificationDropdown from './NotificationDropdown';
import { getNotifications } from '../actions/notificationActions';
import CategoryDropdown from './CategoryDropdown';
import { Nav,
         UncontrolledDropdown, 
         DropdownToggle,
         DropdownMenu, 
         DropdownItem,
         NavLink,
         Modal,
         ModalHeader,
         ModalBody,
         ModalFooter
} from 'reactstrap';
import { Button } from '@material-ui/core';
import Searchbar from './Searchbar';
import '../style/CircularImage.css';
import '../style/NavbarText.css';
import {AccountCircleOutlined, BorderColorOutlined, SettingsOutlined} from "@material-ui/icons";

class Navbar extends Component {

    state = {
        notifications: [],
        check: false,
        forceLogin: false
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.auth.user && this.props.auth.user && !this.state.check) {
            this.setState({ check: true });
            this.props.getNotifications(this.props.auth.user.id, this.props.auth.user.likes_notif_active, this.props.auth.user.comments_notif_active, this.props.auth.user.tags_notif_active, this.props.auth.user.follows_notif_active);
        }
        if(prevProps.notifications.notifications !== this.props.notifications.notifications) {
            this.setState({ notifications: this.props.notifications.notifications });
        }
    }

    redirectToProfile = (event) => {
        event.preventDefault();
        window.location.href = `/profile/${this.props.auth.user.username}`;
    }

    forceLogin = () => {
        this.setState({ forceLogin: !this.state.forceLogin });
    }

    goToCompose = (event) => {
        event.preventDefault();
        window.location.href = '/pre-compose';
    }

    goToHome = (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = '/';
    }

    render() {
        const { isAuthenticated, user, isAdmin } = this.props.auth;
        const authDropdown = (
            <>
            { isAdmin ? null : (
                                    <div id="hover-box" style={{display: 'flex', alignItems:'center', cursor: 'pointer', marginRight: 15}} onClick={this.goToCompose}>
                                        <a className="nav-link hover-text" href="/pre-compose" style={{color: 'black'}}>Escribí</a>
                                        {/*<img src="/assets/compose.png" width="25" height="25"/>*/}
                                        <BorderColorOutlined />
                                    </div>
                                )
            }
            <NotificationDropdown notifications={this.state.notifications}/>
            { isAdmin && user ? null : 
                <div className="profile-div" style={{display: 'flex', alignItems: 'center', verticalAlign: 'middle'}} onClick={this.redirectToProfile}>
                    <img src={user ? `${user.profile_image}` : null} alt="user" height="25" width="25" className="img-wrapper-navbar"/>
                    <a className="nav-link" style={{margin: 0, padding: 0, paddingLeft: 10}}>{user ? user.username : null}</a>
                </div>
            }
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem>
                        <strong>{ user ? `Bienvenido, ${user.username}`: '' }</strong>
                    </DropdownItem>
                    <hr style={{margin: 0}}/>
                    <DropdownItem>
                        <NavLink href={ user ? `/profile/${user.username}` : null} style={{color: 'black', display: 'flex'}}>
                            {/*<img src={'/assets/user-option.png'} width={30} height={30} alt={'user'}/>*/}
                            <AccountCircleOutlined />
                            <p style={{fontFamily: 'Public Sans', marginTop: 0, marginBottom: 0}}>Mi perfil</p>
                        </NavLink>
                    </DropdownItem>
                    <hr style={{margin: 0}}/>
                    <DropdownItem>
                        <NavLink href={ user ? `/profile/${user.username}/configuration/` : null} style={{color: 'black', display: 'flex'}}>
                            {/*<img src={'/assets/settings-option.png'} width={30} height={30} alt={'settings'}/>*/}
                            <SettingsOutlined />
                            <p style={{fontFamily: 'Public Sans', marginTop: 0, marginBottom: 0}}>Configuración</p>
                        </NavLink>
                    </DropdownItem>
                    <hr style={{margin: 0}}/>
                    <DropdownItem>
                        <Logout />
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
            </>    
        );
    
        const anonDropdown = (
            <>
                <div id="hover-box" style={{display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 3}} onClick={this.forceLogin}>
                    {/*<a className="nav-link hover-text" style={{color: 'black'}}>Escribí</a>
                    <img src="/assets/compose.png" width="25" height="25" alt="Escribir"/>*/}
                    <button type={'button'} data-toggle={'tooltip'} data-placement={'bottom'} title={'Escribí'} style={{backgroundColor: 'transparent', border: 'none'}}>
                        {/*<img src="/assets/compose.png" width="25" height="25" alt="Escribir"/>*/}
                        <BorderColorOutlined />
                    </button>
                </div>
                <Modal isOpen={this.state.forceLogin} toggle={this.forceLogin} style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', overflowY: 'scroll', maxHeight: '85%'}}>
                    <ModalHeader>Para escribir, creá tu cuenta o ingresá</ModalHeader>
                    <ModalBody>¡Iniciá sesión para seguir descubriendo contenido!</ModalBody>
                    <ModalFooter>
                        <Button className="btn btn-light btn-outline-dark" style={{padding: 0}}><Login/></Button>
                        <Button className="btn btn-light btn-outline-dark" style={{padding: 0}}><Register/></Button>
                        <Button className="btn btn-light btn-outline-dark" onClick={this.forceLogin}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
                <Login/>
                <Register/>
            </>
        );
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top" style={{zIndex: 10000}}>
                <a href="/" className="navbar-brand">
                    <img id={'navbar-logo'} className="navbar-brand" src="/assets/logo-complete.png" width="60" height="60"/>
                </a>
                <button className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        style={{marginLeft: 'auto', marginRight: 0}}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <UncontrolledDropdown nav inNavbar style={{listStyle: 'none', marginRight: 'auto'}}>
                        <DropdownToggle nav caret>Categorías</DropdownToggle>
                        <DropdownMenu left>
                            <CategoryDropdown/>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <Searchbar/>
                    <Nav className="ml-auto" navbar>
                        {isAuthenticated ? authDropdown : anonDropdown}
                    </Nav>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    notifications: state.notifications
});

export default connect(mapStateToProps, { getNotifications })(Navbar);
