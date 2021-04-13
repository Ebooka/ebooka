import React, {Component} from 'react';
import { Container, Spinner } from 'reactstrap';
import Draft from './Draft';
import Ad from './Ad';
import '../style/WritingsList.css'

class DraftsList extends Component {

    loadedContent = () => {
        if(this.props.drafts && this.props.drafts.length === 0)
            return (
                <Container style={{ textAlign: 'center', width: '100%' }}>
                    <h3>No hay resultados</h3>
                </Container>
            );
        else
            return (
                <div style={{maxHeight: '90vh', width: '100%', padding: 0}}>
                    {this.props.drafts.map((draft, idx) => {
                        if(idx % 4 === 3)
                            return (
                                <div>
                                    <Ad/>
                                    <Draft current={draft}/>
                                </div>);
                        return (<Draft current={draft}/>);
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
            this.props.drafts === null ? this.loadingContent() : this.loadedContent()
        );
    }
}

export default DraftsList;
