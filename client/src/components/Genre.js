import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getGenre } from '../actions/writingActions';
import { Container, Spinner } from 'reactstrap';
import WritingsList from './WritingsList';
import AdsColumn from './AdsColumn';
import {hashtags} from "../static/hashtags";

const genre = window.location.href.split('/genre/')[1];

class Genre extends Component {

    componentDidMount() {
        this.props.getGenre(genre);
    }

    parseGenre = (genre) => {
        if(genre.includes('%20'))
            genre = genre.replaceAll('%20', ' ');
        if(genre.includes('%C3%B3'))
            genre = genre.replaceAll('%C3%B3', 'ó');
        return genre;
    }

    description = (genre) => {
        let phrase = '';
        switch(genre) {
            case 'Novela':
                break;
            case 'Poesía':
                break;
            case 'Conociendo el mundo':
                phrase = 'Compartí tu experiencia viajando ✈️';
                break;
            case 'Querido X':
                phrase = '📫 ¿A quién le escribirías una carta y por qué?. \n 📪 Esa carta que se escribió o que nunca se envió';
                break;
            case 'Cuento':
                break;
            case 'Todos decimos':
                phrase = 'Tu espacio para reflexionar, sentir y pensar';
                break;
            case 'Inspirados':
                const hashtagRandomIndex = Math.floor(Math.random() * hashtags.length);
                phrase = `No estoy inspirado… inspirame… ${hashtags[hashtagRandomIndex]}` ;
                break;
            default:
                break;
        }
        return phrase;
    }

    render() {
        if(!this.props.writings) {
            return (
                <Container className="col-9" style={{ textAlign: 'center', position: 'fixed', top: 90 }}>
                    <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
                </Container>
            );
        } else if(this.props.writings.length === 0) {
            return (
                <Container style={{width: '75%', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '90%'}}>
                    <div className="row" style={{overflow: 'hidden'}}>
                        <Container className="col-9" style={{ textAlign: 'center' }}>
                            <div id="header" style={{textAlign: 'center', marginBottom: 30}}>
                                <h1>{this.parseGenre(genre)}</h1>
                                <p style={{fontFamily: 'Public Sans'}}>{this.description(this.parseGenre(genre))}</p>
                            </div>
                            <h3>No hay escritos publicados bajo la categoría <i>{this.parseGenre(genre)}</i> aún</h3>
                        </Container>
                    </div>
                </Container>
            ); 
        } else {
            return (
                <Container style={{width: '75%', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '80%'}}>
                    <div id="header" style={{textAlign: 'center'}}>
                        <h1>{this.parseGenre(genre)}</h1>
                        <p style={{fontFamily: 'Public Sans'}}>{this.description(this.parseGenre(genre))}</p>
                    </div>
                    <div className="row" style={{overflow: 'scroll', height: '100%'}}>
                        <Container className="col-9">
                            <WritingsList filteredWritings={this.props.writings} expanded={true}/>
                        </Container>
                    </div>
                </Container>
            );
        }
    }
}

const mapStateToProps = state => ({
    writings: state.writing.writings
});

export default connect(mapStateToProps, { getGenre })(Genre);
