import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getGenre } from '../actions/writingActions';
import { Container, Spinner } from 'reactstrap';
import WritingsList from './WritingsList';
import {hashtags} from "../static/hashtags";
import {genres} from "../static/genres";
import FiltersList from './FiltersList';

const url = window.location.href.split('/genre/')[1];
const genre = url?.includes('/filter') ? url.split('/filter')[0] : url;

class Genre extends Component {

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
                phrase = `No estoy inspirado… inspírame… ${hashtags[hashtagRandomIndex]}` ;
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
                    <div className="row" style={{height: '100%'}}>
                        <Container className={'col-md-3 col-12 ml-auto mr-auto'}>
                            <FiltersList/>
                        </Container>
                        <Container className="col-md-9 col-12">
                            <WritingsList fullUrl={url} genre={genre} expanded={true} style={{height: '70vh'}}/>
                        </Container>
                    </div>
                </Container>
            );
    }
}

const mapStateToProps = state => ({
    writings: state.writing.writings
});

export default connect(mapStateToProps, { getGenre })(Genre);
