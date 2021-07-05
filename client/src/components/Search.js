import React, { Component } from 'react'
import { connect } from 'react-redux';
import { searchTerm } from '../actions/searchActions';
import SearchResultList from './SearchResultList';
import { Container, Spinner } from 'reactstrap';
import Soundex from 'soundex';
import { stringSimilarity } from 'string-similarity-js';
const stuff = require('../static/genres');
let genres = stuff.genres;


class Search extends Component {

    state = {
        term: '',
        filter: null,
        search: null,
    }

    componentDidMount() {
        const search = window.location.href.split('/search/')[1];
        let term = '';
        let filter = null;
        if(search.includes('?')) {
            term = search.split('?')[0].replace(/-/gi, ' ');
            filter = search.split('?')[1].split('filter=')[1];
        } else {
            term = search;
            this.checkForGenre(term);
        }
        this.setState({ term: term, filter: filter });
        this.props.searchTerm(term, filter);
    }

    checkForGenre = (term) => {
        let termPhonetics = Soundex(term);
        let similarity = 0;
        let bestGenre = '';
        for(let i = 0 ; i < genres.length ; i++) {
            let current = stringSimilarity(termPhonetics, Soundex(genres[i].genre));
            if(current > similarity) {
                similarity = current;
                bestGenre = genres[i].genre;
            }
        }
        if(similarity > 0.69) { // elegido a ojo, testeando con qué palabras quería que entraran como coincidentes
            window.location.href = window.location.href.split('/search')[0] + '/genre/' + bestGenre;
        }
    }

    render() {
        if(!this.props.search) {
            return (
                <div style={{textAlign: 'center', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)'}}>
                    <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
                    <h3>Buscando: <i>{this.state.term}</i></h3>
                </div>
            );
        } else if(this.props.search.length === 0) {
            return (
                <div style={{textAlign: 'center', marginTop: 20}}>
                    <h3>No se encontraron resultados para: <i>{this.state.term}</i></h3>
                </div>
            );
        } else {
            return (
                <Container style={{width: '80%'}}>
                    <div style={{marginTop: 20}}>
                        <SearchResultList results={this.props.search}
                                          term={this.state.term}
                                          filter={this.state.filter}/>
                    </div>
                </Container>
            );
        }
    } 
}

const mapStateToProps = (state) => ({
    search: state.search.search,
});

export default connect(mapStateToProps, { searchTerm })(Search);
