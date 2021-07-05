import React, { Component } from 'react'
import '../style/Searchbar.css'
import { autoComplete } from '../static/autoComplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {SearchOutlined} from "@material-ui/icons";
const iconPath = process.env.PUBLIC_URL + '/assets/';

class Searchbar extends Component {
    
    state = {
        search: ''
    }

    componentDidMount() {
        if(window.location.href.includes('search')) {
            let term = window.location.href.split('/search/')[1].replace(/-/gi, ' ');
            if(term.includes('filter')) {
                term = term.split('?')[0];
            }
            this.setState({ search: term });
        }
        autoComplete(document.getElementById('myInput'));
    }

    search = () => {
        const trimmed = this.state.search.trim();
        if(trimmed !== '')
            window.location.href = `/search/${trimmed.split(' ').join('-')}`;
    }
    
    preventEnter = (event) => {
        if(event.keyCode === 13) {
            event.preventDefault();
            this.search();
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    
    render() {
        return (
            <form className="form-inline my-2 my-md-0" style={{flexFlow: 'row'}}>
                <div style={{border: 'solid 1px #DADADA', borderRadius: 5}}>
                    <input id="myInput"
                        class="form-control sm-2"
                        type="search" autoComplete="off" name="search"
                        placeholder="Ingresá tu búsqueda"
                        aria-label="Busqueda"
                        onInput={this.onChange}
                        onChange={this.onChange}
                        value={this.state.search}
                        onKeyDown={this.preventEnter}
                        style={{border: 'none', paddingRight: 0, marginRight: 0, width: '88%'}}/>
                    {/*<FontAwesomeIcon icon={faSearch}/>*/}
                    <SearchOutlined />
                </div>
                {/*<button class="btn btn-outline-light my-2 my-sm-0" type="button" onClick={this.search}>
                    <img src={`${iconPath}search.png`} alt="search" height="20" width="20"/>
                </button>*/}
            </form>
        )
    }
}

export default Searchbar
