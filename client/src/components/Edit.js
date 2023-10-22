import React, { Component } from 'react';
import '../style/Compose.css';
import '../style/Editor.css';
import { Container, Form, Button, FormGroup, Label, Input, CustomInput } from 'reactstrap';
import {addWriting, getWriting, getWritingCorrect, setCurrentWriting} from '../actions/writingActions';
import {editDraft, getDraft, getDraftCorrect, setCurrentDraft} from '../actions/draftActions';
import { connect } from 'react-redux';
import axios from 'axios';
import {Chip} from "@material-ui/core";
import {withRouter} from 'react-router-dom';
const stuff = require('../static/genres');

let genres = stuff.genres;

class Compose extends Component {

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
        checked: false,
        cover: '',
        currentChapter: 1,
        chapters: [],
        type: '',
        error: false,
    }

    componentDidMount() {
        let info = window.location.href.split('/edit/')[1].split('?');
        const id = info[0];
        const type = info[1];
        this.setState({ id, type });
        axios.get(`${process.env.REACT_APP_API_URL}/${type}s/compose-data/${id}`)
            .then(res => this.setState({...res.data, fetching: false}))
            .catch(err => this.setState({ fetching: false, error: true }));
    }

    uploadCover = (event) => {
        event.preventDefault();
        let coverPreview = document.getElementById('cover-preview');
        let imageInput = document.getElementById('cover-input');
        const reader = new FileReader();
        reader.readAsDataURL(imageInput.files[0]);
        reader.onloadend = () => {
            coverPreview.src = reader.result;
            this.setState({ cover: reader.result });
        }
    }

    edit = (isWriting) => {
        const newObject = {
            title: this.state.title,
            description: this.state.description,
            genre: this.state.genre,
            subgenre: this.state.subgenre,
            writer_id: this.props.auth.user.id,
            tags: this.state.tags,
            completed: this.state.completed,
            body: this.state.body,
            chapters: this.state.genre === 'Novela' ? this.state.chapters : null,
            currentChapter: this.state.currentChapter
        };
        const destination = isWriting ? 'writings' : 'drafts/edit/';
        axios.put(`${process.env.REACT_APP_API_URL}/api/${destination}/${this.state.id}`, newObject)
            .then(res => window.location.href = `/edit-compose/${this.state.id}?${this.state.type}`);
    }

    goToEditor = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const isWriting = this.state.type === 'writing';
        this.edit(isWriting);
        const object = {
            title: this.state.title,
            description: this.state.description,
            genre: this.state.genre,
            subgenre: this.state.subgenre,
            writer_id: this.props.auth.user.id,
            tags: this.state.tags,
            completed: this.state.completed,
            body: this.state.body,
            chapters: this.state.chapters,
            currentChapter: this.state.currentChapter,
            cover: this.state.cover,
        };
        if(isWriting) {
            this.props.setCurrentWriting(object);
        } else {
            this.props.setCurrentDraft(object)
        }
        const destination = isWriting ? 'writings' : 'drafts/edit';
        axios.put(`${process.env.REACT_APP_API_URL}/api/${destination}/${this.state.id}`, object)
            .then(() => this.props.history.push(`/edit-compose/${this.state.id}?${this.state.type}`));
    }

    onChange = (event) => {
        if(event.target.name === 'genre') {
            genres.map(genre => {
                if(genre.genre === event.target.value) {
                    if(genre.sub)
                        this.setState({ 
                            subgenreslist: genre.sub, 
                            subgenre: genre.sub[0]
                        });
                    else
                        this.setState({ 
                            subgenreslist: genre.sub, 
                            subgenre: null
                        });
                }
            });
        }
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    removeTag = (index) => {
        const updatedTags = [...this.state.tags];
        updatedTags.splice(index, 1);
        this.setState({
            tags: updatedTags
        });
    }

    readTags = (event) => {
        const input = event.target.value;
        if(event.key === 'Enter' && input) {
            if(this.state.tags.find(tag => tag.toLowerCase() === input.toLowerCase()))
                return;
            const oldTags = this.state.currentWriting.tags;
            oldTags.push(input);
            this.setState({
                tags: oldTags
            });
            event.target.value = '';
        } else if(event.key === 'Backspace' && !input) {
            this.removeTag(this.state.tags.length - 1);
        }
    }

    delete = (event) => {
        event.preventDefault();
    }


    componentDidUpdate(prevProps) {
        if((this.props.currentWriting || this.props.currentDraft) && !this.state.checked) {
            const currentObject = this.props.currentWriting ? this.props.currentWriting : this.props.currentDraft;
            this.setState({...currentObject});
            genres.map(genre => {
                if(genre.genre === currentObject.genre) {
                    if(genre.sub)
                        this.setState({
                            subgenreslist: genre.sub,
                            subgenre: genre.sub[0]
                        });
                    else
                        this.setState({
                            subgenreslist: genre.sub,
                            subgenre: null
                        });
                }
            });
            this.setState({checked: true, isAllowed: true, cover: currentObject.cover});
        } else if(!this.state.checked){
            if(this.props.auth.user !== prevProps.auth.user && this.state.type === 'draft') {
                this.props.getDraftCorrect(this.state.id);
            } else if(this.props.auth.user !== prevProps.auth.user && this.state.type === 'writing') {
                this.props.getWritingCorrect(this.state.id);
            }
        }
    }

    completed = (event) => {
        this.setState({ completed: !this.state.completed });
    }

    allowedComponents = () => {
        if(this.state.error) {
            return (
                <div id="full-container-compose" style={{marginBottom: 50, height: '90%', display: 'flex', left: '50%', transform: 'translate(-50%, 0)', width: 'max-content', maxWidth: '50%', position: 'fixed', top: 90, overflowY: 'scroll'}}>
                    <h1>Borrador inexistente</h1>
                </div>
            )
        }
        return (
            <div id="full-container-compose" style={{marginBottom: 50, height: '90%', display: 'flex', left: '50%', transform: 'translate(-50%, 0)', width: 'max-content', maxWidth: '50%', position: 'fixed', top: 90, overflowY: 'scroll'}}>
                <div id="book-cover-container" style={{width: '30vw', overflow: 'none', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <div id="cover-compose" style={{width: '100%', height: '60%', border: 'solid 1px black', textAlign: 'center', marginTop: 20}}>
                        <img src={this.state.cover} id="cover-preview" style={{height: '100%', width: '100%'}}/>
                    </div>
                    <Form style={{marginTop: 10}}>
                        <FormGroup>
                            <CustomInput type="file" id="cover-input" name="cover" label="Elegí la tapa del escrito" onChange={this.uploadCover} />
                        </FormGroup>
                    </Form>
                </div>
                <Container style={{maxWidth: '55vw', marginBottom: 50, maxHeight: '90vh', marginLeft: 10}}>
                    <Form className="main-form">
                        <FormGroup>
                            <Label for="title">Título</Label>
                            <Input type="text" name="title" placeholder="Ingresá el título del escrito" onChange={this.onChange} style={{backgroundColor: 'white'}} value={this.state.title}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">{`Descripción (${400 - this.state.description.length} caracteres restantes)`}</Label>
                            <Input type="textarea" name="description" maxLength="400" placeholder="Ingresá la descripción del escrito en hasta 400 caracteres" onChange={this.onChange} value={this.state.description}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="genre">Categoría</Label>
                            <Input type="select" name="genre" onChange={this.onChange} value={this.state.genre}>
                                {genres.map(genre => (
                                    <option key={genre.genre}>{genre.genre}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        {
                            this.state.subgenreslist &&
                            <FormGroup id="subgenre">
                                <Label for="subgenre">Subcategoría</Label>
                                <Input type="select" name="subgenre" onChange={this.onChange}
                                       value={this.state.subgenre}>
                                    {this.state.subgenreslist ? this.state.subgenreslist.map(sub => (
                                        <option key={sub}>{sub}</option>
                                    )) : null}
                                </Input>
                            </FormGroup>
                        }
                        <FormGroup>
                            <Label for="tags">Elegí tus tags</Label>
                            <div className="input-tag-div" style={{overflowY: 'scroll', height: '200px'}}>
                                <ul className="input-tag-tags" style={{height: '40px'}}>
                                    { this.state.tags.map((tag, i) => (
                                        <Chip label={tag} onDelete={() => this.removeTag(i)}/>
                                    ))}
                                    <li className="input-tag-tags-input">
                                        <Input id="main-input" type="text" onKeyDown={this.readTags} style={{backgroundColor: 'white', height: '50%'}}/>
                                    </li>
                                </ul>
                            </div>                        
                        </FormGroup>
                        <FormGroup>
                            <CustomInput type="switch" id="completed-switch" name="completed" label="Terminado" onClick={this.completed} checked={!this.state.completed}/>
                        </FormGroup>
                    </Form>
                    <Button type="button" className="btn" id="publish" onClick={this.goToEditor} style={{backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}}>Ir a escribir</Button>
                    <Button type="button" className="btn" id="delete" onClick={this.delete} style={{backgroundColor: '#EC1009', borderColor: '#EC1009', color: 'white'}}>Descartar</Button>
                </Container>
            </div>
        )
    }

    permissionDeniedComponents = () => (
        <Container>
            <h1>Acceso denegado</h1>
        </Container>
    )

    render() {
        return this.state.isAllowed ? this.allowedComponents() : this.permissionDeniedComponents();
    }
}

const mapStateToProps = state => ({
    writing: state.writing,
    auth: state.auth,
    draft: state.draft,
    currentWriting: state.writing.currentWriting,
    loading: state.writing.loading || state.draft.loading,
    currentDraft: state.draft.currentDraft,
});

export default connect(mapStateToProps, { addWriting, editDraft, getDraft, getWritingCorrect, setCurrentWriting, getDraftCorrect, setCurrentDraft })(withRouter(Compose));
