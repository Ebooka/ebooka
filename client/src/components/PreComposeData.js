import React, { Component } from 'react'
import {
    Container,
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    CustomInput,
    ModalHeader,
    ModalBody,
    Modal,
    ModalFooter
} from 'reactstrap';
import { connect } from 'react-redux';

const stuff = require('../static/genres');
let genres = stuff.genres;

class PreComposeData extends Component {

    state = {
        title: '',
        description: '',
        genre: genres[0].genre,
        subgenreslist: genres[0].sub ? genres[0].sub : [],
        subgenre: genres[0].sub ? genres[0].sub[0] : '',
        body: '',
        tags: [],
        completed: false,
        cover: null,
        chapters: [],
        currentChapter: 1,
        warningModalIsOpen: false,
        toggleWarningModal: false,
        emptyInputs: []
    }

    componentDidMount() {
        let isData = document.cookie.includes('writingData');
        if(isData) {
            let cookies = document.cookie.split('; ');
            for(let i = 0 ; i < cookies.length ; i++) {
                if(cookies[i].includes('writingData')) {
                    let data = JSON.parse(cookies[i].split('=')[1]);
                    this.setState(data);
                    genres.map(genre => {
                        if(genre.genre === data['genre']) {
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
            }
        }
        let cover = window.localStorage.getItem('coverData');
        if(cover) {
            this.setState({ cover });
        }
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
            const oldTags = this.state.tags;
            oldTags.push(input);
            this.setState({
                tags: oldTags
            });
            event.target.value = '';
        } else if(event.key === 'Backspace' && !input) {
            this.removeTag(this.state.tags.length - 1);
        }
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

    toggleWarningModal = () => {
        this.setState({ warningModalIsOpen: !this.state.warningModalIsOpen });
    }

    checkForEmpty = event => {
        let emptyInputs = [];
        if(this.state.title === '')
            emptyInputs.push('Título');
        if(this.state.description === '')
            emptyInputs.push('Descripción');
        if(this.state.tags.length === 0)
            emptyInputs.push('Tags');
        console.log(emptyInputs);
        if(emptyInputs.length !== 0) {
            console.log(emptyInputs);
            this.setState({ emptyInputs: emptyInputs });
            this.toggleWarningModal();
        } else {
            this.goToEditor(event);
        }

    }

    goToEditor = (event) => {
        const newWriting = {
            title: this.state.title,
            description: this.state.description,
            genre: this.state.genre,
            subgenre: this.state.subgenre,
            writer_id: this.props.auth.user.id,
            tags: this.state.tags,
            completed: this.state.completed,
            body: this.state.body,
            chapters: this.state.chapters,
            currentChapter: this.state.currentChapter
        };
        let cookie = `writingData=${JSON.stringify(newWriting)}`;
        window.localStorage.setItem('coverData',this.state.cover);
        document.cookie = cookie;
        window.location.href = '/compose';
    }

    render() {
        let tags = this.state.tags;
        return (
            <div id="full-container-compose" style={{marginBottom: 50, height: '85%', overflowY: 'scroll', display: 'flex', left: '50%', transform: 'translate(-50%, 0)', width: 'max-content', maxWidth: '90%', position: 'fixed', top: 90}}>
                <div id="book-cover-container" style={{width: '40vw', overflow: 'none', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <div id="cover-compose" style={{width: '100%', height: '100%', border: 'solid 1px black', textAlign: 'center', marginTop: 20}}>
                        <img src={this.state.cover} id="cover-preview" style={{height: '100%', width: '100%'}}/>
                    </div>
                    <Form style={{marginTop: 10}}>
                        <FormGroup>
                            <label class="btn btn-outline-info" for="cover-input" style={{fontFamily: 'Public Sans', fontSize: 15}}>Subir Tapa</label>
                            <input type="file" id="cover-input" name="cover-input" onChange={this.uploadCover} style={{display: 'none'}}/>
                        </FormGroup>
                    </Form>
                </div>
                <Container style={{width: '85vw', marginBottom: 50, maxHeight: '90vh', marginLeft: 10}}>
                    <Form className="main-form">
                        <FormGroup>
                            <Label for="title">Título</Label>
                            <Input type="text" name="title" placeholder="Ingresá el título del escrito" onChange={this.onChange} style={{backgroundColor: 'white'}} value={this.state.title ? this.state.title : null}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">{`Descripción (${400 - this.state.description.length} caracteres restantes)`}</Label>
                            <Input type="textarea" name="description" maxLength="400" placeholder="Ingresá la descripción del escrito en hasta 400 caracteres" onChange={this.onChange} value={this.state.description ? this.state.description : null}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="genre">Categoría</Label>
                            <Input type="select" name="genre" onChange={this.onChange} value={this.state.genre}>
                                {genres.map(genre => (
                                    <option key={genre.genre}>{genre.genre}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup id="subgenre">
                            <Label for="subgenre">Subcategoría</Label>
                            <Input type="select" name="subgenre" onChange={this.onChange} value={this.state.subgenre}>
                                {this.state.subgenreslist ?  this.state.subgenreslist.map(sub => (
                                    <option key={sub}>{sub}</option>
                                )) : null}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="tags">Elegí tus tags</Label>
                            <div className="input-tag-div" style={{overflowY: 'scroll', height: '200px'}}>
                                <ul className="input-tag-tags" style={{height: '40px'}}>
                                    { tags.map((tag, i) => (
                                        <li key={tag}>
                                            {tag}
                                            <button type="button" onClick={() => { this.removeTag(i); }}>x</button>
                                        </li>
                                    ))}
                                    <li className="input-tag-tags-input">
                                        <Input id="main-input" type="text" onKeyDown={this.readTags} style={{backgroundColor: 'white', height: '50%'}}/>
                                    </li>
                                </ul>
                            </div>                        
                        </FormGroup>
                        <FormGroup>
                            <CustomInput type="switch" id="completed-switch" name="completed" label="Terminado" onClick={this.completed} onChange={this.completed} checked={!this.state.completed}/>
                        </FormGroup>
                    </Form>
                    <div id="buttons-container" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                        <Button type="button" className="btn" id="publish" onClick={this.checkForEmpty} style={{backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}}>Ir a escribir</Button>
                        <Button type="button" className="btn" id="delete" onClick={this.delete} style={{backgroundColor: '#EC1009', borderColor: '#EC1009', color: 'white'}}>Descartar</Button>
                    </div>
                </Container>
                <Modal isOpen={this.state.warningModalIsOpen} toggle={this.toggleWarningModal} style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', width: '50%'}}>
                    <ModalHeader>¡Cuidado!</ModalHeader>
                    <ModalBody>
                        <p style={{fontFamily: 'Public Sans'}}>Los siguientes campos están vacíos:</p>
                        <ul>
                        {
                            this.state.emptyInputs.map(input => {
                                return <li>{input}</li>
                            })
                        }
                        </ul>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.goToEditor} style={{backgroundColor: 'white', borderColor: '#3B52A5', color: '#3B52A5'}}>Continuar</Button>
                        <Button onClick={this.toggleWarningModal} style={{backgroundColor: '#3B52A5', borderColor: '#3B52A5', color: 'white'}}>Completar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    writing: state.writing,
    auth: state.auth,
    draft: state.draft
});

export default connect(mapStateToProps, null)(PreComposeData);
