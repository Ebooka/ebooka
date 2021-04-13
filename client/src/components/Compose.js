import React, { Component } from 'react';
import '../style/Compose.css';
import '../style/Editor.css';
import { Container, Button } from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { addWriting, addChapters } from '../actions/writingActions';
import { addDraft } from '../actions/draftActions';
import { connect } from 'react-redux';
const stuff = require('../static/genres');
let genres = stuff.genres;

const editorConfig = {
    toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList'],
    height: 700
};

class Compose extends Component {

    state = {
        title: '',
        description: '',
        genre: genres[0].genre,
        subgenreslist: genres[0].sub ? genres[0].sub : [],
        subgenre: genres[0].sub ? genres[0].sub[0] : '',
        body: '',
        tags: [],
        completed: false,
        mainInput: null,
        cover: null,
        chapters: [''],
        currentChapter: 1,
    }

    componentDidMount() {
        let isData = document.cookie.includes('writingData');
        if(isData) {
            let cookies = document.cookie.split('; ');
            for(let i = 0 ; i < cookies.length ; i++) {
                if(cookies[i].includes('writingData')) {
                    this.setState(JSON.parse(cookies[i].split('=')[1]));
                    break;
                }
            }
        }
    }

    saveWriting = async (event) => {
        event.preventDefault();
        const coverString = localStorage.getItem('coverData');
        const newWriting = {
            title: this.state.title,
            description: this.state.description,
            genre: this.state.genre,
            subgenre: this.state.subgenre,
            body: this.state.genre === 'Novela' ? this.state.chapters[0] : this.state.body,
            writer_id: this.props.auth.user.id,
            tags: this.state.tags,
            completed: this.state.completed,
            cover: coverString !== undefined ? coverString : null,
            chapters: this.state.chapters
        };
        console.log(this.state.chapters);
        await this.props.addWriting(newWriting, null, this.state.chapters);
        document.cookie = 'writingData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // delete unnecesary cookie
        localStorage.removeItem('coverData');
        window.location.href = '/';
    }

    saveDraft = async (event) => {
        event.preventDefault();
        const coverString = localStorage.getItem('coverData');
        const newDraft = {
            title: this.state.title,
            description: this.state.description,
            genre: this.state.genre,
            subgenre: this.state.subgenre,
            body: this.state.genre === 'Novela' ? this.state.chapters[0] : this.state.body,
            writer_id: this.props.auth.user.id,
            tags: this.state.tags,
            completed: this.state.completed,
            cover: coverString !== undefined ? coverString : null
        };
        await this.props.addDraft(newDraft, this.state.chapters);
        document.getElementById('draft-alert').style.display = 'block';
    }

    componentDidUpdate(prevProps) {
        if(this.props.draft.drafts !== prevProps.draft.drafts) {
            window.location.href = `/edit/${this.props.draft.drafts.id}`;
        }
    }

    onEditorChange = (event, editor) => {
        let bodyHTML = editor.getData();
        let chaptersCopy = this.state.chapters;
        chaptersCopy[this.state.currentChapter - 1] = bodyHTML;
        this.setState({
            chapters: chaptersCopy,
            body: bodyHTML
        });
    }

    delete = (event) => {
        event.preventDefault();
    }

    goBackToInfo = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const newWriting = {
            title: this.state.title,
            description: this.state.description,
            genre: this.state.genre,
            subgenre: this.state.subgenre,
            writer_id: this.props.auth.user.id,
            tags: this.state.tags,
            completed: this.state.completed,
            cover: this.state.cover,
            body: this.state.body,
            chapters: this.state.chapters,
            currentChapter: this.state.currentChapter
        };
        document.cookie = `writingData=${JSON.stringify(newWriting)}`;
        window.location.href = '/pre-compose';
    }

    isNovel = () => this.state.genre === 'Novela';

    changeCurrentChapter = (event, number) => {
        if(event) {
            event.preventDefault();
            event.stopPropagation();
        }
        document.getElementById(`chapter-${number}`).style.backgroundColor = 'green';
        document.getElementById(`chapter-${this.state.currentChapter}`).style.backgroundColor = 'blue';
        this.setState({
            currentChapter: number,
            body: this.state.chapters[number - 1]
        });
    }

    showChapterButtons = () => {
        return (<div id="chapters-container" style={{marginTop: 10, marginBottom: 10, textAlign: 'left', display: 'flex', flexDirection: 'row', width: 'fit-content', flexWrap: 'wrap'}}>
            <div id="chapters-added">
                {
                    this.state.chapters.map((chapter, idx) => {
                        return (<button className="btn btn-primary" id={`chapter-${idx + 1}`} onClick={event => this.changeCurrentChapter(event, idx + 1)} style={this.state.currentChapter === (idx + 1) ? {backgroundColor: 'green'} : null}>{`Capítulo ${idx + 1}`}</button>);
                    })
                }
            </div>
            <Button onClick={this.addChapter}>+ Agregar capítulo</Button>
        </div>);
    }

    addChapter = (event) => {
        let newChaptersArray = this.state.chapters;
        newChaptersArray.push('');
        this.setState({chapters: newChaptersArray});
    }

    render() {
        return (
            <Container style={{overflowY:'scroll', width: '70%', textAlign: 'center', marginBottom: 50, position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '80%'}}>
                <div style={{textAlign: 'left'}}>
                    <Button style={{marginBottom: 10, marginRight: 0, marginLeft: 'auto'}} onClick={this.goBackToInfo}>{`< Volver`}</Button>
                </div>
                { this.isNovel() ? this.showChapterButtons() : null }
                <CKEditor 
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={`${this.state.body}`}
                    onInit={editor => { editor.data.set(this.state.body) }}
                    onChange={(event, editor) => this.onEditorChange(event, editor)}
                    style={{height: 700}}
                />
                <div className="alert" role="alert" style={{display: 'none', backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}} id="draft-alert">
                    ¡Borrador guardado con éxito!
                </div>
                <Button type="button" className="btn" id="publish" onClick={this.saveWriting} style={{backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}}>Publicar!</Button>
                <Button type="button" className="btn" id="draft" onClick={this.saveDraft} style={{backgroundColor: 'white', borderColor: '#3B52A5', color: '#3B52A5'}}>Guardar borrador</Button>
                <Button type="button" className="btn" id="delete" onClick={this.delete} style={{backgroundColor: '#EC1009', borderColor: '#EC1009', color: 'white'}}>Descartar</Button>

            </Container>
        )
    }
}

const mapStateToProps = state => ({
    writing: state.writing,
    auth: state.auth,
    draft: state.draft
});

export default connect(mapStateToProps, { addWriting, addDraft, addChapters })(Compose);
