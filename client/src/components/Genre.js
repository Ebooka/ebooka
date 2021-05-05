import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getGenre } from '../actions/writingActions';
import { Container, Spinner } from 'reactstrap';
import WritingsList from './WritingsList';
import AdsColumn from './AdsColumn';
import {hashtags} from "../static/hashtags";
import {genres} from "../static/genres";

const genre = window.location.href.split('/genre/')[1];

class Genre extends Component {

    componentDidMount() {
        this.props.getGenre(genre);
        console.log(genre);
    }

    parseGenre = (genre) => {
        if(genre.includes('%20'))
            genre = genre.replaceAll('%20', ' ');
        if(genre.includes('%C3%B3'))
            genre = genre.replaceAll('%C3%B3', 'ó');
        if(genre.includes('%C3%ADa'))
            genre = genre.replaceAll('%C3%ADa', 'ía');
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

    getBg = genreName => {
        const genreObject = genres.filter(genre => genre.genre === genreName)[0];
        return genreObject?.color;
    }

    render() {
        if(!this.props.writings) {
            return (
                <Container className="col-9" style={{ textAlign: 'center', position: 'fixed', top: 90 }}>
                    <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
                </Container>
            );
        } else if(this.props.writings.length === 0) {
            const genreParsed = this.parseGenre(genre);
            return (
                <Container style={{width: '75%', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '90%'}}>
                    <div className="row" style={{overflow: 'hidden'}}>
                        <Container className="col-9" style={{ textAlign: 'center' }}>
                            <div id="header" style={{textAlign: 'center', marginBottom: 30}}>
                                <div className={'genre-title-container-color-box'}
                                     style={{borderRadius: 10, backgroundColor: this.getBg(genreParsed), width: 'max-content', padding: '10px 20px',color: 'white', margin: '10px auto'}}>
                                    <h1>{genreParsed}</h1>
                                </div>
                                <p style={{fontFamily: 'Public Sans'}}>{this.description(genreParsed)}</p>
                            </div>
                            <h3>No hay escritos publicados bajo la categoría <i>{genreParsed}</i> aún</h3>
                        </Container>
                    </div>
                </Container>
            ); 
        } else {
            const genreParsed = this.parseGenre(genre);
            return (
                <Container style={{width: '75%', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '80%'}}>
                    <div id="header" style={{textAlign: 'center'}}>
                        <div className={'genre-title-container-color-box'}
                             style={{borderRadius: 10, backgroundColor: this.getBg(genreParsed), width: 'max-content', padding: '10px 20px',color: 'white', margin: '10px auto'}}>
                            <h1>{genreParsed}</h1>
                        </div>
                        <p style={{fontFamily: 'Public Sans'}}>{this.description(genreParsed)}</p>
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
