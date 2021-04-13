import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getWriting, addViewer, addAnonViewer, getChapters } from '../actions/writingActions';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import '../style/Sidebar.css';
import '../style/BookPages.css';
import WritingData from './WritingData';
import {Drawer} from "@material-ui/core";

const PHONE_SCREEN_WIDTH = 400;
const LAPTOP_SCREEN_WIDTH = 1440;
const WORDS_COEFFICIENT = window.screen.width >= LAPTOP_SCREEN_WIDTH ? 1 : window.screen.width/LAPTOP_SCREEN_WIDTH;
const WORDS_PER_PAGE = Math.floor(420 * WORDS_COEFFICIENT);

class Read extends Component {

    state = {
        pageNumber: 1,
        wordsPerPage: [],
        currentPage: 0,
        wordCount: 0,
        text: null,
        chapters: null,
        currentChapter: 1,
        chapterStartPage: [],
        counted: false,
        sidebarOpen: false
    }

    static propTypes = {
        getWriting: PropTypes.func.isRequired,
        writing: PropTypes.object.isRequired,
    }

    componentDidMount() {
        const id = window.location.href.split('/read/')[1];
        this.props.getWriting(id);
    }

    componentDidUpdate(prevProps) {
        if(this.props.writing.writings !== prevProps.writing.writings) {
            if (this.props.auth.user) {
                const viewers = this.props.writing.writings[0].viewers;
                if (this.props.auth.user.id !== this.props.writing.writings[0].writer_id && (!viewers || !viewers.includes(this.props.auth.user.id))) {
                    this.props.addViewer(this.props.auth.user.id, this.props.writing.writings[0].id);
                }
            } else {
                let cookies = document.cookie;
                if (!cookies.includes('anon_id')) {
                    const anonId = uuid();
                    document.cookie = `anon_id=${anonId}`;
                    this.props.addAnonViewer(anonId, this.props.writing.writings[0].id);
                }
            }
        }
        if(this.props.writing.writings && this.props.writing.writings[0].genre === 'Novela' && !this.state.chapters) {
            const id = this.props.writing.writings[0].id;
            axios.get(`/api/writings/chapters/${id}`)
                .then(res => {
                    let chaptersContent = [];
                    res.data.map(object => {
                        chaptersContent.push(object.body);
                    });
                    console.log(chaptersContent);
                    this.setState({
                        chapters: chaptersContent,
                    });
                })
        }
        if(this.props.writing.writings && this.props.writing.writings[0].genre !== 'Novela' && !this.state.chapters) {
            this.setState({ chapters: [] });
        }
    }

    bookCover = () => {
        let { writings } = this.props.writing;
        const title = writings[0].title;
        const username = writings[0].username;
        const cover = writings[0].cover;
        if(cover) {
            return (
                <div id="cover-content" className="cover">
                    <h3>{username}</h3>
                    <img src={cover} height="300" width="300"/>
                    <h2>{title}</h2>
                </div>
            );
        } else {
            return (
                <div id="cover-content" className="cover">
                    <h4>{username}</h4>
                    <div style={{height: 400, width: 300, border: 'solid 1px black', marginLeft: 'auto', marginRight: 'auto'}}>
                        TAPA
                    </div>
                    <h2>{title}</h2>
                </div>
            );
        }

    }

    pageContent = () => {
        let index;
        let body;
        let bodyTag;
        if(this.props.writing.writings[0].genre === 'Novela') {
            index = this.state.currentPage;
            body = this.state.wordsPerPage[index];
            bodyTag = new DOMParser().parseFromString(body, 'text/html').childNodes[0].childNodes[1];
        } else if(this.state.text) {
            index = this.state.currentPage;
            body = this.state.text;
            const wordsCountStart = index * WORDS_PER_PAGE - WORDS_PER_PAGE;
            let wordsArray = body.innerHTML.split(' ');
            let content = '';
            for(let word = wordsCountStart ; word < wordsCountStart + WORDS_PER_PAGE && wordsArray[word]; word++) {
                content += wordsArray[word];
                content += ' ';
            }
            bodyTag = new DOMParser().parseFromString(content, 'text/html').childNodes[0].childNodes[1];
        }
        return (
            <div className="full-page">
                <div className="page-content">
                    {(Array.from(bodyTag.childNodes)).map(node => (
                        <p style={{fontFamily: 'Public Sans'}}>{node.textContent}</p>
                    ))}
                </div>
                <div className="footer">
                    { index <= this.state.pageNumber ? `${index} de ${this.state.pageNumber}` : null}
                </div>
            </div>
        );
    }

    turnPageBack = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const prevIdx = this.state.currentPage - 1;
        if(prevIdx >= 0) {
            this.setState({currentPage: prevIdx});
            if (this.state.chapterStartPage.includes(prevIdx)) {
                const idx = this.state.chapterStartPage.indexOf(prevIdx);
            } else if (this.state.currentChapter - 1 > 0 && this.state.chapterStartPage[this.state.currentChapter - 1] > prevIdx) {
                const prevChapterIdx = this.state.chapterStartPage.indexOf(this.state.chapterStartPage[this.state.currentChapter - 2]);
            }
        }
    }

    turnPageForward = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const nextIdx = this.state.currentPage + 1;
        if(nextIdx <= this.state.pageNumber) {
            this.setState({currentPage: nextIdx});
            if (this.state.chapterStartPage.includes(nextIdx)) {
                const idx = this.state.chapterStartPage.indexOf(nextIdx)
                this.setState({currentChapter: idx + 1});
            }
        }
    }

    countWordsNovel = () => {
        if(!this.state.counted) {
            let pageStart = [];
            var wordsPerPage = [];
            let currentPage = 0;
            this.state.chapters.forEach((chapterUnparsedContent, idx) => {
                let unparsed = '';
                if(pageStart.length < this.state.chapters.length) {
                    let length = chapterUnparsedContent.split(' ').length;
                    let pagesNeeded = Math.ceil(length / WORDS_PER_PAGE);
                    let chapterStartIndex = idx > 0 ? pageStart[idx - 1] + pagesNeeded : 1;
                    pageStart.push(chapterStartIndex);
                    // TODO ver lo del formatting para que me respete al menos los enters
                    unparsed += chapterUnparsedContent;
                    const parsed = new DOMParser().parseFromString(unparsed, 'text/html');
                    const body = parsed.childNodes[0].childNodes[1].innerText;
                    let incremented = false;
                    currentPage = chapterStartIndex;
                    let count = 0;
                    wordsPerPage[currentPage] = '';
                    for(let i = 0 ; i < body.length ; i++) {
                        if(count % WORDS_PER_PAGE === (WORDS_PER_PAGE - 1) && !incremented) {
                            currentPage++;
                            incremented = true;
                            wordsPerPage[currentPage] = '';
                        }
                        if(count % WORDS_PER_PAGE === 0)
                            incremented = false;
                        wordsPerPage[currentPage] += body.charAt(i);
                        if(body.charAt(i) === ' ')
                            count++;
                    }
                }
            });
            this.setState({
                chapterStartPage: pageStart,
                wordsPerPage: wordsPerPage,
                pageNumber: wordsPerPage.length - 1,
                counted: true
            });
        }
    }

    countWords = () => {
        let unparsed = '';
        if(this.props.writing.writings[0].genre === 'Novela') {
            this.countWordsNovel();
        } else {
            unparsed = this.props.writing.writings[0].body;
            let parsed = new DOMParser().parseFromString(unparsed, 'text/html');
            this.setState({text: parsed.childNodes[0].childNodes[1]});
            const body = parsed.childNodes[0].childNodes[1].innerText;
            console.log(body);
            let count = 0;
            let pageNumber = 1;
            let wordsPerPage = [];
            let incremented = false;
            console.log(WORDS_PER_PAGE, body.length);
            for (let i = 0; i < body.length; i++) {
                if (count % WORDS_PER_PAGE === (WORDS_PER_PAGE - 1) && !incremented) {
                    pageNumber++;
                    incremented = true;
                }
                if (count % WORDS_PER_PAGE === 0) {
                    incremented = false;
                }
                if (body.charAt(i) !== undefined)
                    wordsPerPage[pageNumber] += body.charAt(i);
                if (body.charAt(i) === ' ')
                    count++;
            }
            count++;
            console.log(count);
            this.setState({
                wordsPerPage: wordsPerPage,
                wordCount: count,
                pageNumber: wordsPerPage.length - 1,
                counted: true
            });
        }
    }

    goToChapterStart = (event, idx) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            currentPage: this.state.chapterStartPage[idx],
            currentChapter: idx + 1
        });
    }

    goToFirstPage = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({currentPage: 1});
    }

    goToLastPage = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({currentPage: this.state.pageNumber});
    }

    toggleSidebar = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }

    loadedComponents = () => {
        if(!this.state.counted)
            this.countWords();
        return (
                <div id="reading-container">
                    <div id="top-bar" style={{backgroundColor: 'white', padding: 10, paddingLeft: 20, display: 'flex', justifyContent: 'center'}}>
                        { this.state.chapters.length > 0 ? <button className="open-sidebar" id="open-button" onClick={this.toggleSidebar}>&#9776;</button> : null }
                        <h5 style={{marginRight: 5}}>{this.props.writing.writings[0].title} - {this.props.writing.writings[0].username}</h5>
                    </div>
                    <div className="row">
                        <div id="full-container">
                            <Drawer anchor={'left'} open={this.state.sidebarOpen} onClick={this.toggleSidebar}>
                                {this.state.chapters.map((chapter, idx) => {
                                    return (
                                        <p style={{cursor: 'pointer', fontFamily: 'Public Sans', margin: '10px 50px 10px 10px'}} onClick={event => this.goToChapterStart(event, idx)}>{`Capítulo ${idx+1}`}</p>
                                    );
                                })}
                            </Drawer>
                            <div id="book-container">
                                <div id="book-page">
                                    {this.state.currentPage === 0 ? this.bookCover() : this.pageContent()}
                                </div>
                            </div>
                            <div id="buttons-container">
                                <button className="btn btn-outline-dark" id="prev-button" disabled={this.state.currentPage === 0} onClick={event => this.goToFirstPage(event)}>
                                    <span>{'<<'}</span>
                                </button>
                                <button className="btn btn-outline-dark" id="prev-button" disabled={this.state.currentPage <= 0} onClick={event => this.turnPageBack(event)}>
                                    <span>{'<'}</span>
                                </button>
                                <button className="btn btn-outline-dark" id="next-button" disabled={this.state.currentPage >= this.state.pageNumber} onClick={event => this.turnPageForward(event)}>
                                    <span>{'>'}</span>
                                </button>
                                <button className="btn btn-outline-dark" id="next-button" disabled={this.state.currentPage === this.state.pageNumber} onClick={event => this.goToLastPage(event)}>
                                    <span>{'>>'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }

    loadingComponent = () => (
        <div style={{ textAlign: 'center'}}>
            <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
        </div>
    )

    render() {
        let { writings } = this.props.writing;
        if(writings) {
            return (
                <div style={{
                    width: '100%',
                    position: 'fixed',
                    top: 90,
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    height: '80%',
                    overflowY: 'scroll',
                    fontFamily: 'Public Sans'
                }}>
                    {writings && this.state.chapters ? this.loadedComponents() : this.loadingComponent()}
                    <WritingData data={this.props.writing.writings[0]}/>
                </div>
            );
        } else {
            return (<img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>)
        }
    }
}

const mapStateToProps = state => ({
    writing: state.writing,
    auth: state.auth
});

export default connect(mapStateToProps, { getWriting, addViewer, addAnonViewer })(Read);

