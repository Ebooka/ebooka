import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
const stuff = require('../static/genres');
let genres = stuff.genres;

const loadInitialFilters = () => {
    let params = window.location.href.split('/filter?')[1];
    let set = new Set();
    if(params) {
        let genres = '';
        if(params.includes('genre')) {
            genres = params.split('genre=')[1];
            genres = genres.split('&')[0];
            let array = genres.split(',');
            array.forEach(genre => {
                if(genre.includes('%20'))
                    set.add(genre.replaceAll('%20', ' '));
                else if(genre.includes('%C3%AD'))
                    set.add(genre.replaceAll('%C3%AD', 'í'));
                else
                    set.add(genre);
            });
        }
    }
    return set;
}

const getDefaultValue = () => {
    let sort = 'most-recent';
    if(window.location.href.includes('filter')) {
        let params = window.location.href.split('/filter?')[1].split('&')[0];
        if(params.includes('sort')) {
            sort = params.split('sort=')[1].split('&').join('');
        }
    }
    return sort;
}

class FiltersList extends Component {

    state = {
        genresActive: loadInitialFilters(),
        default: getDefaultValue()
    }

    onFilter = (event) => {
        event.preventDefault();
        let options = document.getElementsByClassName('options-sort');
        let selected = 'most-recent';
        for(let i = 0 ; i < options.length ; i++){
            if(options[i].selected)
                selected = options[i].id;
        }
        let filters = 'filter?sort=' + selected;
        if(this.state.genresActive.size > 0) {
            filters += '&genre=';
            this.state.genresActive.forEach(filter => {
                filters += `${filter},`;
            });
            filters = filters.slice(0, -1);
        } 
        window.location.href = window.location.href.split('filter')[0] + filters;
    }

    checkbox = (event) => {
        let set = this.state.genresActive;
        this.state.genresActive.has(event.target.name) ? set.delete(event.target.name) : set.add(event.target.name);
        this.setState(set);
    }

    render() {
        return (
            <div style={{width: '100%'}}>
                <ListGroup>
                    <h4>Categorías:</h4>
                    {genres.map(genre => (
                        <ListGroupItem key={genre.genre} className="justify-content-between">
                            <div id={`filter-${genre.genre}`} style={{display: 'flex'}}>
                                <input type="checkbox" id={genre.genre} onChange={this.checkbox} name={genre.genre} checked={this.state.genresActive.has(genre.genre)}/>
                                <div style={{ backgroundColor: genre.color, color: 'white', width: '80%', borderRadius: 3, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center'}}>
                                    <strong style={{overflowWrap: 'break-word'}}>{genre.genre}</strong>
                                </div>
                            </div>
                        </ListGroupItem>
                    ))}
                    <h4 style={{ marginTop: 10 }}>Ordenar por:</h4>
                    <select className="form-control" name="sort" id="sort" defaultValue={this.state.default}>
                        <option className="options-sort" id="most-recent" value="most-recent">Más recientes</option>
                        <option className="options-sort" id="less-recent" value="less-recent">Más antiguos</option>
                        <option className="options-sort" id="more-likes" value="more-likes">Más Likes</option>
                    </select>
                </ListGroup>
                <Button type="button" className="btn btn-primary mt-3" onClick={this.onFilter}>Filtrar</Button>
            </div>
        )
    }
}

export default FiltersList;
