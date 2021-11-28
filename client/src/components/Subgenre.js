import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import WritingsList from './WritingsList';
import {genres} from "../static/genres";
import FiltersList from './FiltersList';

const subgenre = window.location.href.split('/subgenre/')[1]?.split('/filter')[0];
const genre = window.location.href.split('/genre/')[1]?.split('/subgenre')[0];
const url = window.location.href.split('/genre/')[1];

class Genre extends Component {

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
            return (
                <Container style={{width: '75%', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '90%'}}>
                    <div style={{textAlign: 'center'}}>
                        <div className={'genre-title-container-color-box'}
                             style={{borderRadius: 10, backgroundColor: this.getBg(genreParsed), width: 'max-content', padding: '10px 20px',color: 'white', margin: '10px auto'}}>
                            <h1>{genreParsed}</h1>
                        </div>
                        <h3>{subgenre}</h3>
                    </div>
                    <div className={'row'} style={{height: '100%'}}>
                        <Container className={'col-md-3 col-12 ml-auto mr-auto'}>
                            <FiltersList/>
                        </Container>
                        <Container className="col-md-9 col-12">
                            <WritingsList
                                filteredWritings={this.props.writings}
                                expanded={true}
                                genre={genre}
                                subgenre={subgenre}
                                fullUrl={url}
                                style={{height: '70vh'}}
                            />
                        </Container>
                    </div>
                </Container>
            );
    }
}

const mapStateToProps = state => ({
    writings: state.writing.writings
});

export default connect(mapStateToProps, null)(Genre);
