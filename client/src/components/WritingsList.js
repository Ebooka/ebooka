import React, {Component} from 'react';
import { Container, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import Writing from './Writing';
import '../style/WritingsList.css'

class WritingsList extends Component {

    loadedContent = () => {
        const style = this.props.style;
        if(this.props.writings && this.props.writings.length === 0)
            return (
                <Container style={{ textAlign: 'center', width: '100%' }}>
                    <h3>No hay resultados</h3>
                </Container>
            );
        else
            return (
                <div style={{maxHeight: '90vh', width: '100%', padding: 0, ...style}}>
                    {this.props.writings.map((writing, idx) => {
                        /*if(idx % 4 === 3)
                            return (
                                <div>
                                    <Ad/>
                                    <Writing current={writing} expanded={this.props.expanded}/>
                                </div>);*/
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
        return (
            this.props.writings === null ? this.loadingContent() : this.loadedContent()
        );
    }
}

const mapStateToProps = (state) => ({
    writings: state.writing.writings,
});

export default connect(mapStateToProps, null)(WritingsList);
