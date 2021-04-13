import React, { Component } from 'react';
import '../style/Compose.css';
import '../style/Editor.css';
import { Container, Button } from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { addWriting, addChapters } from '../actions/writingActions';
import { editDraft } from '../actions/draftActions';
import { connect } from 'react-redux';
import axios from "axios";
const stuff = require('../static/genres');
let genres = stuff.genres;

const editorConfig = {
    toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList'],
    height: 700
};

class EditCompose extends Component {

    state = {
        id: -1,
        title: '',
        description: '',
        genre: genres[0].genre,
        subgenreslist: genres[0].sub ? genres[0].sub : [],
        subgenre: genres[0].sub ? genres[0].sub[0] : '',
        body: '',
        tags: [],
        completed: false,
        cover: null,
        chapters: [''],
        chaptersId: [],
        currentChapter: 1,
        type: '',
        fetching: true
    }

    componentDidMount() {
        let info = window.location.href.split('/edit-compose/')[1].split('?');
        const id = info[0];
        const type = info[1];
        this.setState({ id, type});
        axios.get(`/api/writings/compose-data/${id}`)
            .then(res => {
                console.log(res.data);
                this.setState({...res.data, fetching: false});
            })
            
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
            cover: coverString !== undefined ? coverString : null
        };
        await this.props.addWriting(newWriting, this.state.id, this.state.chapters);
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
        await this.props.editDraft(newDraft, this.state.chapters, this.state.id);
        //document.cookie = 'writingData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // delete unnecesary cookie
        //localStorage.removeItem('coverData');
        document.getElementById('draft-alert').style.display = 'block';
    }

    componentDidUpdate(prevProps) {
        if(this.props.draft.drafts !== prevProps.draft.drafts) {
            window.location.href = `/edit/${this.state.id}`;
        } else if (this.state.type === 'writing' && this.state.chapters && this.state.chapters.length > 1 && this.state.genre === 'Novela') {
            axios.get(`/api/writings/chapters/${this.state.id}`)
                .then(res => {
                    let chaptersId = [];
                    let chaptersContent = [];
                    res.data.map(object => {
                        chaptersId.push(object.id);
                        chaptersContent.push(object.body);
                    });
                    this.setState({
                        chapters: chaptersContent,
                        chaptersId: chaptersId
                    });
                })
        }
    }

    onEditorChange = (event, editor) => {
        let bodyHTML = editor.getData();
        if(this.state.genre === 'Novela') {
            let chaptersCopy = this.state.chapters;
            chaptersCopy[this.state.currentChapter - 1] = bodyHTML;
            this.setState({
                chapters: chaptersCopy,
                body: bodyHTML
            });
        } else {
            this.setState({
                body: bodyHTML
            });
        }
    }

    delete = (event) => {
        event.preventDefault();
    }

    editRegular = async (isWriting) => {
        const newObject = {
            title: this.state.title,
            description: this.state.description,
            genre: this.state.genre,
            subgenre: this.state.subgenre,
            tags: this.state.tags,
            completed: this.state.completed,
            body: this.state.body,
            chapters: null,
        };
        const destination = isWriting ? 'writings' : 'drafts';
        await axios.put(`/api/${destination}/${this.state.id}`, newObject);
    }

    editChapterContent = async (ids) => {
        let chapters = this.state.chapters;
        ids.map(async (id, idx) => {
            const body = this.state.chapters[idx];
            await axios.put(`/api/writings/chapters/${id}`, {body: body});
        })
    }
    createNewChapters = async (ids, offset) => {
        let chapters = this.state.chapters;
        ids.map(async (id, idx) => {
            const body = this.state.chapters[idx + offset];
            await axios.post(`/api/writings/chapters`, {body: body, writing_id: this.state.id});
        })
    }

    editNovel = async (isWriting) => {
        const currentLength = this.state.chapters.length;
        const originalLength = this.state.chaptersId.length;
        if(currentLength === originalLength) {
            await this.editChapterContent(this.state.chaptersId);
        } else if(currentLength > originalLength) {
            const diff = currentLength - originalLength;
            const newChapterIds = this.state.chaptersId.slice(diff * -1); // start from the end
            const oldChapterIds = this.state.chaptersId.slice(diff);
            await this.editChapterContent(oldChapterIds);
            await this.createNewChapters(newChapterIds, originalLength);
        }
    }

    goBackToInfo = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(this.state.genre === 'Novela') {
            await this.editNovel();
        } else {
            await this.editRegular(this.state.type === 'writing');
        }
        window.location.href = `/edit-compose/${this.state.id}?${this.state.type}`;
        /*const newWriting = {
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
        document.cookie = `writingData=${JSON.stringify(newWriting)};path=/`;
        window.location.href = `/edit/${this.state.id}?${this.state.type}`;*/
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
        console.log(this.state);
        if(this.state.fetching) {
            return <Container style={{
                overflowY: 'scroll',
                width: '70%',
                textAlign: 'center',
                marginBottom: 30,
                position: 'fixed',
                top: 90,
                left: '50%',
                transform: 'translate(-50%, 0)',
                height: '90%'
            }}>
                <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
            </Container>
        } else {
            return (
                <Container style={{
                    overflowY: 'scroll',
                    width: '70%',
                    textAlign: 'center',
                    marginBottom: 30,
                    position: 'fixed',
                    top: 90,
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    height: '90%'
                }}>
                    <div style={{textAlign: 'left'}}>
                        <Button style={{marginBottom: 10, marginRight: 0, marginLeft: 'auto'}}
                                onClick={this.goBackToInfo}>{`< Volver a información`}</Button>
                    </div>
                    {this.isNovel() ? this.showChapterButtons() : null}
                    <CKEditor
                        editor={ClassicEditor}
                        config={editorConfig}
                        data={`${this.state.body}`}
                        onInit={editor => {
                            editor.data.set(this.state.body)
                        }}
                        onChange={(event, editor) => this.onEditorChange(event, editor)}
                        style={{height: 700}}
                    />
                    <div className="alert alert-success" role="alert" style={{display: 'none', backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}} id="draft-alert">
                        ¡Borrador guardado con éxito!
                    </div>
                    <Button type="button" className="btn btn-success" id="publish"
                            onClick={this.saveWriting}>Guardar!</Button>
                    <Button type="button" className="btn btn-info" id="draft" onClick={this.saveDraft}>Guardar
                        borrador</Button>
                    <Button type="button" className="btn" id="delete"
                            onClick={this.delete} style={{backgroundColor: '#EC1009', borderColor: '#EC1009', color: 'white'}}>Descartar</Button>
                </Container>
            );
        }
    }
}

const mapStateToProps = state => ({
    writing: state.writing,
    auth: state.auth,
    draft: state.draft
});

export default connect(mapStateToProps, { addWriting, editDraft, addChapters })(EditCompose);

