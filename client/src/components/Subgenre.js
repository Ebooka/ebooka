import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getSubgenre } from '../actions/writingActions';
import { Container, Spinner } from 'reactstrap';
import WritingsList from './WritingsList';
import AdsColumn from './AdsColumn';
import {genres} from "../static/genres";

const subgenre = window.location.href.split('/subgenre/')[1];
const genre = window.location.href.split('/genre/')[1]?.split('/subgenre')[0];

class Genre extends Component {

    componentDidMount() {
        this.props.getSubgenre(this.parseGenre(genre), subgenre);
    }

    parseGenre = (genre) => {
        if(genre.includes('%20'))
            genre = genre.replaceAll('%20', ' ');
        if(genre.includes('%C3%B3'))
            genre = genre.replaceAll('%C3%B3', 'ó');
        if(genre.includes('%C3%AD'))
            genre = genre.replaceAll('%C3%AD', 'í');
        return genre;
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

    getBg = genreName => {
        const genreObject = genres.filter(genre => genre.genre === genreName)[0];
        return genreObject?.color;
    }

    render() {
        const genreParsed = this.parseGenre(genre);
        if(!this.props.writings) {
            return (
                <Container className="col-9" style={{ textAlign: 'center', top: 90, position:'fixed', left: '50%', transform: 'translate(-50%, 0)', height: '90%' }}>
                    <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
                </Container>
            );
        } else if(this.props.writings.length === 0) {
            return (
                <Container style={{width: '75%', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '90%'}}>
                    <div className="row" style={{overflow: 'hidden'}}>
                    <Container className="col-9" style={{ textAlign: 'center' }}>
                        <div className={'genre-title-container-color-box'}
                             style={{borderRadius: 10, backgroundColor: this.getBg(genreParsed), width: 'max-content', padding: '10px 20px',color: 'white', margin: '10px auto 25px auto'}}>
                            <h1>{genreParsed}</h1>
                        </div>
                        <h3>No hay escritos publicados en la subcategoría <i>{this.parseGenre(subgenre)}</i> aún</h3>
                    </Container>
                    </div>
                </Container>
            ); 
        } else {
            return (
                <Container style={{width: '75%', position: 'fixed', top: 90, overflowY: 'scroll', left: '50%', transform: 'translate(-50%, 0)', height: '90%'}}>
                    <Container className="col-9" style={{ textAlign: 'center', margin: '10px auto 25px auto' }}>
                        <div className={'genre-title-container-color-box'}
                             style={{borderRadius: 10, backgroundColor: this.getBg(genreParsed), width: 'max-content', padding: '10px 20px',color: 'white', margin: '10px auto'}}>
                            <h1>{genreParsed}</h1>
                        </div>
                        <h3>{subgenre}</h3>
                    </Container>
                    <WritingsList filteredWritings={this.props.writings} expanded={true}/>
                </Container>
            );
        }
    }
}

const mapStateToProps = state => ({
    writings: state.writing.writings
});

export default connect(mapStateToProps, { getSubgenre })(Genre);
