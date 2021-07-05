import React, { Component } from 'react';
import { Jumbotron, 
         Button, 
         Badge,
         Spinner, 
         Dropdown, 
         DropdownToggle,
         DropdownMenu, 
         DropdownItem,
         ModalHeader,
         ModalBody,
         Modal} from 'reactstrap';
import { genres } from '../static/genres';
import '../style/Writing.css'
import {
    AddCircleOutline,
    AddCircleOutlineOutlined,
    DeleteOutlineOutlined,
    ExpandMore,
    ExpandMoreOutlined
} from "@material-ui/icons";

const iconPath = process.env.PUBLIC_URL + '/assets/';

class Draft extends Component {

    state = {
        previewLimit: (this.props.expanded ? 500 : 250),
        previewLimitModal: 500,
        toggle: false,
        toggleReadMore: false,
        deleteToggle: false,
    }

    stripHTML = (html) => {
        let tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerHTML || '';
    }

    toggle = () => {
        this.setState({toggle: !this.state.toggle});
    }

    delete = (event) => {
        event.preventDefault();
        document.getElementById(`main-draft${this.props.current.id}`).style.display = 'none';
        this.deleteToggle(event);        
        this.props.deleteWriting(this.props.current.id);
    }

    deleteToggle = (event) => {
        event.preventDefault();
        this.setState({deleteToggle: !this.state.deleteToggle});
    }

    selectContent = (modal) => {
        let current = this.props.current;
        if(!current.description || current.description === '') {
            let strippedBody = this.stripHTML(current.body);
            const needsPreview = !modal ? (strippedBody.length > this.state.previewLimit ? true : false) : (strippedBody.length > this.state.previewLimitModal ? true : false);
            return needsPreview ? strippedBody.substring(0, !modal ? this.state.previewLimit : this.state.previewLimitModal) + '...' : strippedBody
        } else {
            if(!modal && current.description.length < this.state.previewLimit) {
                return current.description;
            } else if(modal && current.description.length < this.state.previewLimit) {
                const strippedBody = this.stripHTML(current.body);
                const needsPreview = !modal ? (strippedBody.length > this.state.previewLimit ? true : false) : (strippedBody.length > this.state.previewLimitModal ? true : false);
                return needsPreview ? strippedBody.substring(0, this.state.previewLimitModal) + '...' : strippedBody
            } else if(!modal && current.description.length > this.state.previewLimit) {
                return current.description.substring(0, this.state.previewLimit) + '...';
            } else {
                return current.description.substring(0, this.state.previewLimitModal) + '...';
            }
        }
    }

    goToEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const id = this.props.current.id;
        console.log('clicked => ', id);
        window.location.href = `/edit/${id}?draft`;
    }

    render() {
        let current = this.props.current;
        if(current) {
            let color = '';
            genres.forEach(genreObject => {
                if(genreObject.genre === current.genre) {
                    color = genreObject.color;
                }
            });
            return (
                <div id={`main-draft${this.props.current.id}`} onClick={this.goToEdit}>
                <Jumbotron style={{padding: 10, maxHeight: 750, borderRadius: 5, backgroundColor: 'white', cursor: 'pointer'}}>
                    <div id="top-bar" style={{display: 'flex'}}>
                        <div id="text-content" style={this.props.current.cover && this.props.expanded ? {display: 'flex', flexDirection: 'column', marginLeft: 15, width: '73%'} : {display: 'flex', flexDirection: 'column', width: '100%'}}>
                            <div id="header" style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <h2 className="display-5">{current.title}</h2>
                                <Dropdown isOpen={this.state.toggle} toggle={this.toggle}>
                                    <DropdownToggle nav >
                                        {/*<img src="/assets/expand.png" width="20" height="20"/>*/}
                                        <ExpandMoreOutlined />
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem onClick={this.readMore}>
                                            <div id="expand-option" className="writing-item">
                                                {/*<img src="/assets/more.png" width="25" height="25"/>*/}
                                                <AddCircleOutlineOutlined />
                                                <p>Ver más</p>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem id="edit-option" onClick={this.edit}>
                                                <div id="edit-option" className="writing-item">
                                                <img src="/assets/edit.png" width="25" height="25"/>  
                                                <p>Editar</p>
                                            </div>
                                        </DropdownItem> 
                                        <DropdownItem id="delete-dropdown-item" onClick={this.deleteToggle}>
                                            <div id="delete-option" className="writing-item">
                                                {/*<img src="/assets/bin.png" width="25" height="25" id={'delete-icon'}/>*/}
                                                <DeleteOutlineOutlined />
                                                <p>Eliminar</p>
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            <div>
                                <h4 className="lead" style={{fontSize: '1.45rem'}}>{this.selectContent(false)}</h4>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div className="clickable-container" style={{textAlign: 'left'}}>
                            <hr className="my-2"/>
                            <Badge key={current.id} style={{ backgroundColor: color, color: 'white', marginBottom: 10}}><strong>{current.genre}</strong></Badge>
                        </div>
                    </div>
                </Jumbotron>
                <Modal isOpen={this.state.deleteToggle} toggle={this.deleteToggle} style={{position: 'fixed', top: '25%', left: '50%', transform: 'translate(-50%, 0)'}}>
                    <ModalHeader toggle={this.deleteToggle}>Eliminar escrito</ModalHeader>
                    <ModalBody>
                        <h6>¿Estás seguro que deseas eliminar el borrador?</h6>
                        <p style={{fontFamily: 'Public Sans'}}>El borrador no será recuperable luego de ser eliminado</p>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button className="btn" onClick={this.delete} style={{marginRight: 10, backgroundColor: '#EC1009', borderColor: '#EC1009', color: 'white'}}>Eliminar</Button>
                            <Button className="btn btn-secondary" onClick={this.deleteToggle}>Cancelar</Button>
                        </div>
                    </ModalBody>
                </Modal>
                </div>
            );
        } else {
            return (
                <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
            )
        }
    };
}

export default Draft
//export default connect(null, { deleteDraft })(Draft);
