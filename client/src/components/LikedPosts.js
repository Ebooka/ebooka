import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { getLikedPosts } from '../actions/userActions';

class LikedPosts extends Component {

    state = {
        modal: false,
    }

    toggle = () => {
        if(!this.state.modal) {
            this.props.getLikedPosts(this.props.userId);
        }
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        return (
            <>
                <div className="col-sm col-12" style={{padding: 0, textAlign: 'center', cursor: 'pointer'}} onClick={this.toggle}>
                    <p style={sansStyle}>Likes</p>
                    <p style={sansStyle}>{this.props.liked_posts ? this.props.liked_posts.length : 0}</p>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Escritos likeados</ModalHeader>
                    <ModalBody>
                        {this.props.posts ? this.props.posts.map(post => (<p>{post.title}</p>)) :
                                                    <p>No te gusta ningún escrito todavía.</p>}
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    posts: state.user.posts
});

const sansStyle = {
    fontFamily: 'Public Sans'
}

export default connect(mapStateToProps, { getLikedPosts })(LikedPosts);
