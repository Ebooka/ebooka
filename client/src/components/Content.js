import React, { Component } from 'react'

class Content extends Component {
    render() {
        console.log('content: ' + this.props.node);
        return (
            <div>{this.props.node}</div>
        )
    }
}

export default Content
