import React, { Component } from 'react';
import { Container, Spinner } from 'reactstrap';
import { getDraftsByUser } from '../actions/draftActions';
import { connect } from 'react-redux';

class Drafts extends Component {

    render() {
        if(this.props.auth) {
            let { drafts } = this.props.auth.user;
            return (
                <Container>
                    {drafts.map(draftId => (
                        <div className="draft-container" key={draftId}>
                            hola
                        </div>
                    ))}
                </Container>
            );
        } else {
            return (
                <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
            )
        }
    }
}

const mapStateToProps = state => ({
    drafts: state.drafts
});

export default connect(mapStateToProps, { getDraftsByUser })(Drafts);
