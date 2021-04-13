import React, {Component} from 'react';
import { Container, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import Writing from './Writing';
import Ad from './Ad';
import '../style/WritingsList.css'

class WritingsList extends Component {

    loadedContent = () => {
        let { writings } = this.props.writing;
        if(writings && writings.length === 0)
            return (
                <Container style={{ textAlign: 'center', width: '100%' }}>
                    <h3>No hay resultados</h3>
                </Container>
            );
        else
            return (
                <div style={{maxHeight: '90vh', width: '100%', padding: 0}}>
                    {writings.map((writing, idx) => {
                        if(idx % 4 === 3)
                            return (
                                <div>
                                    <Ad/>
                                    <Writing current={writing} expanded={this.props.expanded}/>
                                </div>);
                        return (<Writing current={writing} expanded={this.props.expanded}/>);
                    })}
                </div>
            );
    };

    loadingContent = () => (
        <Container className="col-6" style={{ textAlign: 'center' }}>
            <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
        </Container>
    );

    render() {
        let { writings } = this.props.writing;
        return (
            writings === null ? this.loadingContent() : this.loadedContent()
        );
    }
}

const mapStateToProps = (state) => ({
    writing: state.writing,
});

export default connect(mapStateToProps, null)(WritingsList);
