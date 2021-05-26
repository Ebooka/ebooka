import React, {Component} from "react";
import '../style/LikeRow.css';

class LikeRow extends Component {

    render() {
        return (
            <div className={'like-row-container'}>
                <img className={'liker-image'} src={this.props.like.profile_image} alt={'user-image'}/>
                <a className={'liker-username'} href={`/user/${this.props.like.username}`}>{this.props.like.username}</a>
            </div>
        );
    };
}

export default LikeRow;
