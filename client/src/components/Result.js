import React, { Component } from 'react'
import { Jumbotron, Button } from 'reactstrap'
import { connect } from 'react-redux';
import Writing from "./Writing";

class Result extends Component {

    toProfile = () => {
        const username = this.props.data.username;
        if(this.props.auth.user && this.props.auth.user.username === username)
            window.location.href = `/profile/${username}`;
        else
            window.location.href = `/user/${username}`
    }

    render() {
        if(this.props.type === 'user') {
            const {username, followers, writings} = this.props.data;
            return (
                <div>
                    <Jumbotron style={{backgroundColor: 'white', wordBreak: 'break-word'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <img src="/assets/user.png" width="70" height="70"/>
                            <p className="display-3" style={{marginLeft: '0.1rem', fontSize: '3rem'}}>{username}</p>
                        </div>
                        <p className="lead" style={fontStyle}>Seguidores: {followers ? followers.length : 0}</p>
                        <p className="lead" style={fontStyle}>Escritos publicados: {writings ? writings.length : 0}</p>
                        <hr className="my-2"/>
                        <Button color="primary" onClick={this.toProfile} style={{...fontStyle, backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}}>Ir al perfil</Button>
                    </Jumbotron>
                </div>
            );
        } else {
            return (
                <Writing current={this.props.data} expanded={false}/>
            );
        }
    }
}

const fontStyle = {
    fontFamily: 'Public Sans'
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, null)(Result);
