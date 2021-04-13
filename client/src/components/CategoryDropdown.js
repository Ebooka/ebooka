import React, { Component } from 'react'
import { DropdownItem, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import '../style/NavbarText.css';

const stuff = require('../static/genres');
const genres = stuff.genres;

class CategoryDropdown extends Component {

    state = {
        novel: false,
        story: false
    }

    toggleNovel = () => {
        this.setState({ novel: !this.state.novel });
    }

    toggleStory = () => {
        this.setState({ story: !this.state.story });
    }

    redirect = (genre) => {
        window.location.href = `/genre/${genre}`;
    }

    redirectSub = (genre, sub) => {
        window.location.href = `/genre/${genre}/subgenre/${sub}`;
    }

    render() {
        return (
            <>
                { genres.map(genre => {
                    switch(genre.genre) {
                        case 'Novela':
                            return (
                                <DropdownItem   style={{padding: '0.25rem 0.1rem 0.25rem 1.5rem'}}
                                                onClick={event => { event.preventDefault();
                                                                    event.stopPropagation();
                                                                    this.redirect(`${genre.genre}`) }}>
                                    <Dropdown direction="right" isOpen={this.state.novel}
                                                                onMouseEnter={this.toggleNovel}
                                                                onMouseLeave={this.toggleNovel}>
                                        <DropdownToggle nav caret style={{padding: 0, color: '#212529'}}>
                                            {genre.genre}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {genre.sub.map(sub => (<DropdownItem onClick={event => {   event.preventDefault();
                                                                                                       event.stopPropagation();
                                                                                                       this.redirectSub(`${genre.genre}`, `${sub}`) }}>
                                                                        {sub}
                                                                    </DropdownItem>
                                                            ))
                                            }
                                        </DropdownMenu>
                                    </Dropdown>
                                </DropdownItem>
                            );
                        case 'Cuento':
                            return (
                                <DropdownItem   style={{padding: '0.25rem 0.1rem 0.25rem 1.5rem'}}
                                                onClick={event => { event.preventDefault();
                                                                    event.stopPropagation(); 
                                                                    this.redirect(`${genre.genre}`) }}>
                                    <Dropdown direction="right" isOpen={this.state.story}
                                                                onMouseEnter={this.toggleStory}
                                                                onMouseLeave={this.toggleStory}>
                                        <DropdownToggle nav caret style={{padding: 0, color: '#212529'}}>
                                            {genre.genre}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {genre.sub.map(sub => (<DropdownItem onClick={event => {    event.preventDefault(); 
                                                                                                        event.stopPropagation();
                                                                                                        this.redirectSub(`${genre.genre}`, `${sub}`) }}>
                                                                        {sub}
                                                                    </DropdownItem>))}
                                        </DropdownMenu>
                                    </Dropdown>
                                </DropdownItem>
                            );
                        default:
                            return (
                                <DropdownItem  onClick={event => {  event.preventDefault(); 
                                                                    this.redirect(`${genre.genre}`) }}>
                                    {genre.genre}
                                </DropdownItem>
                            );
                    }
                })}
            </>   
        )
    }
}

export default CategoryDropdown
