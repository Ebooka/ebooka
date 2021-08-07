import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {Container, Form, FormGroup, Label, Input, Button, Spinner, Alert} from 'reactstrap';
import { updateUser } from '../actions/userActions';
import '../style/ConfigurationTabs.css';
import BlockedAccountsList from './BlockedAccountsList';
import NotificationsList from './NotificationsList';

class Configuration extends Component {

    state = {
        name: '',
        username: '',
        email: '',
        password: '',
        biography: '',
        updateSuccess: false,
        updateError: false,
    }

    componentDidMount() {
        const username = window.location.href.split('/profile/')[1].split('/configuration')[0];
        axios.get(`/api/users/profile_image/${username}`)
            .then(res => {
                this.setState({ url: res.data.profile_image });
            });
    }

    componentDidUpdate(prevProps) {
        if(prevProps.auth.user !== this.props.auth.user && this.props.auth.user) {
            this.setState({
                name: this.props.auth.user.name,
                username: this.props.auth.user.username,
                email: this.props.auth.user.email,
                biography: this.props.auth.user.biography ?? '',
            });
        }
        if(this.props.loading && !prevProps.loading) {
            this.setState({
                updateSuccess: false,
                updateError: false,
            });
        }
        if(prevProps.loading && !this.props.loading && !this.props.updateUserError) {
            this.setState({updateSuccess: true});
        }
        if(prevProps.loading && !this.props.loading && this.props.updateUserError) {
            this.setState({updateError: true});
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let newData = {}
        if(this.state.password === '') {
            newData = {
                name: this.state.name,
                username: this.state.username,
                email: this.state.email,
                password: null,
                biography: this.state.biography
            };
        } else {
            newData = {
                name: this.state.name,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                biography: this.state.biography
            };
        }
        this.props.updateUser(newData, this.props.auth.user.id);
        
    }

    switchContent = (event, name) => {
        let tabContent = document.getElementsByClassName('tabcontent');
        let i;
        for(i = 0 ; i < tabContent.length ; i++) {
            tabContent[i].style.display = 'none';
        }
        let tabLinks = document.getElementsByClassName('tablinks');
        for(i = 0 ; i < tabLinks.length ; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(' active', '');
        }
        document.getElementById(name).style.display = 'block';
        event.currentTarget.className += ' active';
    }

    render() {
        return this.props.auth.user ? (
            <Container style={{width: '70%',  position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%,0)'}}>
                <div style={{width: '80%', marginLeft: 'auto', marginRight: 'auto', backgroundColor: 'white', minHeight: 520, borderRadius: 5, border: 'solid 1px #DADADA'}}>
                    <div className="row" style={{margin: 0}}>
                        <div className="col-3" style={{padding: 0}}>
                            <div className="tab">
                                <button className="tablinks active" onClick={event => this.switchContent(event, 'info')}>Editar perfil</button>
                                <button className="tablinks" onClick={event => this.switchContent(event, 'notifications')}>Notificaciones</button>
                                <button className="tablinks" onClick={event => this.switchContent(event, 'blocked')}>Cuentas bloqueadas</button>
                            </div>
                        </div>
                        <div className="col-9 tabcontent" id="info" style={{display: 'block'}}>
                            <div className="row inner" style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                                <Form>
                                    <div className="row mt-3 mb-3" style={{display: 'flex', alignItems: 'center'}}>
                                        <div className="col-4" style={{display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
                                            <img src={this.props.auth.user.profile_image} height="50" width="50" style={{borderRadius: '50%', marginLeft: 'auto', marginRight: 0}}/>
                                        </div>
                                        <div className="col-8" style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
                                            <h8><strong>{this.props.auth.user.username}</strong></h8>
                                            <a href="#">Cambiar foto de perfil</a>
                                        </div>    
                                    </div>
                                    <div className="row mt-3" style={{display: 'flex'}}>
                                        <div className="col-4" style={{display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
                                            <h5>Nombre completo</h5>
                                        </div>
                                        <div className="col-8" style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
                                            <FormGroup style={{display: 'flex', marginBottom: 0}}>
                                                <Input type="text" name="name" value={this.state.name} onChange={this.onChange} style={{width: '100%'}}/>
                                            </FormGroup>
                                            <p style={{fontSize: 13, color: 'grey'}}>* Recuerda que el mail y el nombre completo no serán públicos, los demás te conocerán por tu nombre de usuario.</p>
                                        </div>    
                                    </div>
                                    <div className="row mb-3 mt-3" style={{display: 'flex', alignItems: 'center'}}>
                                        <div className="col-4" style={{display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
                                            <h5>Email</h5>
                                        </div>
                                        <div className="col-8" style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
                                            <FormGroup style={{display: 'flex', marginBottom: 0}}>
                                                <Input type="email"
                                                       name="email"
                                                       value={this.state.email}
                                                       onChange={this.onChange}
                                                       style={{width: '100%', cursor: this.props.auth.user.external_account ? 'not-allowed' : 'pointer'}}
                                                       disabled={this.props.auth.user.external_account}/>
                                            </FormGroup>
                                        </div>    
                                    </div>
                                    <div className="row mt-3" style={{display: 'flex'}}>
                                        <div className="col-4" style={{display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
                                            <h5>Nombre de usuario</h5>
                                        </div>
                                        <div className="col-8" style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
                                            <FormGroup style={{display: 'flex', marginBottom: 0}}>
                                                <Input type="text"
                                                       name="username"
                                                       value={this.state.username}
                                                       onChange={this.onChange}
                                                       style={{width: '100%', cursor: this.props.auth.user.external_account ? 'not-allowed' : 'pointer'}}
                                                       disabled={this.props.auth.user.external_account}/>
                                            </FormGroup>
                                            <p style={{fontSize: 13, color: 'grey'}}>* Aclaración sobre tiempo de cambio de nombre de usuario.</p>
                                        </div>    
                                    </div>
                                    <div className="row mb-3 mt-3" style={{display: 'flex', alignItems: 'center'}}>
                                        <div className="col-4" style={{display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
                                            <h5>Contraseña</h5>
                                        </div>
                                        <div className="col-8" style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
                                            <FormGroup style={{display: 'flex', marginBottom: 0}}>
                                                <Input type="password"
                                                       name="password"
                                                       placeholder="Ingresá tu nueva contraseña"
                                                       onChange={this.onChange}
                                                       style={{width: '100%', cursor: this.props.auth.user.external_account ? 'not-allowed' : 'pointer'}}
                                                       disabled={this.props.auth.user.external_account}/>
                                            </FormGroup>
                                        </div>    
                                    </div>
                                    <div className="row mb-3 mt-3" style={{display: 'flex', alignItems: 'center'}}>
                                        <div className="col-4" style={{display: 'flex', flexDirection: 'column', textAlign: 'right'}}>
                                            <h5>Biografía</h5>
                                            <p style={{fontSize: 13, color: 'grey'}}>{`(${100-this.state.biography.length} caracteres restantes)`}</p>
                                        </div>
                                        <div className="col-8" style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>
                                            <FormGroup style={{display: 'flex', marginBottom: 0}}>
                                                <Input type="textarea" name="biography" value={this.state.biography} onChange={this.onChange} style={{width: '100%'}}/>
                                            </FormGroup>
                                        </div>    
                                    </div>
                                </Form>
                            </div>
                            {
                                this.state.updateSuccess &&
                                    <div className="alert alert-success" role="alert">
                                        Usuario editado con éxito
                                    </div>
                            }
                            {
                                this.state.updateError &&
                                <div className="alert alert-error" role="alert">
                                    Error editando usuario
                                </div>
                            }
                            <div style={{textAlign: 'center', marginTop: 15, marginBottom: 10}}>
                                <Button className="btn btn-success mr-1" type="submit" onClick={this.onSubmit}>
                                    {
                                        this.props.loading ?
                                            <Spinner size={'sm'} color={'light'}>{''}</Spinner> :
                                            'Guardar cambios'
                                    }
                                </Button>
                            </div>
                        </div>
                        <div className="col-9 tabcontent" id="notifications">
                            <h3>Notificaciones</h3>
                            <NotificationsList id={this.props.auth.user.id}/>
                        </div>
                        <div className="col-9 tabcontent" id="blocked" style={{textAlign: 'center'}}>
                            <h3>Cuentas bloqueadas</h3>
                            <BlockedAccountsList id={this.props.auth.user.id}/>
                        </div>
                        
                    </div>
                </div>
            </Container>
        ) : 
        (   
            <Container style={{textAlign: 'center', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%,0)'}}>
                <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    loading: state.user.loading,
    updateUserError: state.user.updateUserError,
});

export default connect(mapStateToProps, { updateUser })(Configuration);
