import React, { Component } from 'react'
import axios from 'axios';

class TestImageUpload extends Component {
    
    state = {
        imageURL: null
    }

    saveImage = (event) => {
        event.preventDefault();
        const imageInput = document.getElementById('image-input');
        let previewImg = document.getElementById('preview');
        const reader = new FileReader();
        reader.readAsDataURL(imageInput.files[0]);
        reader.onloadend = () => {
            previewImg.src = reader.result;
            axios.post(`${process.env.REACT_APP_API_URL}/api/users/profile_image/eugedamm`, { 
                userImage: reader.result
            })
                .then(res => {
                    axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile_image/eugedamm`)
                        .then(res => {
                            let previewImg2 = document.getElementById('preview2');
                            previewImg2.src = res.data.profile_image;
                        })
                });        
        }
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.saveImage}>
                    <input type="file" name="profile_image" id="image-input"/>
                    <button >Guardar</button>
                </form>
                <img src="" alt="Preview..." id="preview" height='200'/>
                <img src="" alt="Preview..." id="preview2" height='200'/>
            </div>
        )
    }
}

export default TestImageUpload
