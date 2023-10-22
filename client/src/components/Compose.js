import React, { Component } from 'react';
import '../style/Compose.css';
import '../style/Editor.css';
import { Container, Button } from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {addWriting, addChapters, setCurrentWriting, editWriting} from '../actions/writingActions';
import { addDraft } from '../actions/draftActions';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
const stuff = require('../static/genres');
let genres = stuff.genres;

const editorConfig = {
    toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList'],
    height: 700
};

class Compose extends Component {

    state = {
        writingId: null,
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
        const id = window.location.href.split('compose?id=')[1] ?? null;
        this.setState({writingId: id})
        if(this.props.currentWriting) {
            this.setState({
                ...this.props.currentWriting,
                chapters: this.props.currentWriting.chapters ?? [],
            });
            if(id && this.isNovel()) {
                axios.get(`${process.env.REACT_APP_API_URL}/api/writings/chapters/${id}/`)
                    .then(res => this.setState({chapters: res.data}))
                    .catch(err => this.setState({chapters: []}))
            }
        }
    }

    saveWriting = async (event) => {
        event.preventDefault();
        const newWriting = {
            title: this.state.title,
            description: this.state.description,
            genre: this.state.genre,
            subgenre: this.state.subgenre,
            body: this.state.genre === 'Novela' ? this.state.chapters[0].body : this.state.body,
            writer_id: this.props.auth.user.id,
            tags: this.state.tags,
            completed: this.state.completed,
            cover: this.state.cover,
            chapters: this.state.chapters
        };
        if(this.state.writingId) {
            this.props.editWriting(this.state.writingId, newWriting);
        } else {
            await this.props.addWriting(newWriting, null, this.state.chapters);
        }
        this.props.setCurrentWriting(null);
        window.location.href = '/';
    }

    saveDraft = async (event) => {
        event.preventDefault();
        const newDraft = {
            title: this.state.title,
            description: this.state.description,
            genre: this.state.genre,
            subgenre: this.state.subgenre,
            body: this.state.genre === 'Novela' ? this.state.chapters[0] : this.state.body,
            writer_id: this.props.auth.user.id,
            tags: this.state.tags,
            completed: this.state.completed,
            cover: this.state.cover,
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
        chaptersCopy[this.state.currentChapter - 1] = {...chaptersCopy[this.state.currentChapter - 1], body: bodyHTML};
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
        this.props.setCurrentWriting(newWriting);
        this.props.history.push(`/pre-compose${this.state.writingId ? `?id=${this.state.writingId}` : ''}`);
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
            body: this.state.chapters[number - 1].body
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

    addChapter = () => {
        this.setState({chapters: [...this.state.chapters, {id: null, body: ''}]});
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
                <Button type="button" className="btn" id="publish" onClick={this.saveWriting} style={{backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}}>Publicar</Button>
                <Button type="button" className="btn" id="draft" onClick={this.saveDraft} style={{backgroundColor: 'white', borderColor: '#3B52A5', color: '#3B52A5'}}>Guardar borrador</Button>
                <Button type="button" className="btn" id="delete" onClick={this.delete} style={{backgroundColor: '#EC1009', borderColor: '#EC1009', color: 'white'}}>Descartar</Button>

            </Container>
        )
    }
}

const mapStateToProps = state => ({
    writing: state.writing,
    auth: state.auth,
    draft: state.draft,
    currentWriting: state.writing.currentWriting,
});

export default connect(mapStateToProps, { addWriting, addDraft, addChapters, setCurrentWriting, editWriting })(withRouter(Compose));
