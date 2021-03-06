import React, {useState} from 'react';
import Axios from 'axios';
import './UploadArtWork.css';

function UploadArtWork() {
    // get credentials
    const username = localStorage.getItem('username');

    //* data to be sent & its destination
    // const url = 'http://localhost:3001/user/artwork';
    const url = 'https://cool-art-social-media.herokuapp.com/user/artwork';
    const [values, setValues] = useState({
        title: '',
        author: '',
        description: ''
    });
    const [selectedFile, setSelectedFile] = useState('');

    //* message for success or error of uploading
    const [message, setMessage] = useState('');

    //* these codes below set key-value pairs for to-be-sent data
    const fd = new FormData();
    fd.append('image', selectedFile);
    fd.append('title', values.title);
    fd.append('author', values.author);
    fd.append('description', values.description);

    //* functions for event changes
    const handleChange = e => {
        const {name, value} = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };
    const fileSelectChange = e => { setSelectedFile(e.target.files[0]) };
    const handleSubmit = async (e) => { 
        e.preventDefault();
        //* codes below are to make api call to backend: uploading files to database
        try {
            //* validation for file extension & size
            const imageName = selectedFile.name;
            if (!imageName.match(/\.(jpg|jpeg|png)$/)) return setMessage('Please upload an image with png, jpg, or jpeg file extension!');
            const imageSize = Math.round((selectedFile.size));
            if (imageSize > 2000000) return setMessage('File is too big');
            
            const response = await Axios.post(url, fd, {
                headers: {
                    username
                }
            }
            // , {
            //     onUploadProgress: ProgressEvent => {
            //         console.log('Upload progress: ' + Math.round((ProgressEvent.loaded / ProgressEvent.total)*100) + '%');
            //         console.log(username)
            //     }
            // }
            );

            //* showing result of upload
            if (response.data.uploadArtWork) {
                setMessage(response.data.message)
            } else {
                setMessage('Image upload failed');
            };
        } catch (err) {
            // console.error(err);
            console.log(err);
        };
    };

    return (
        <div id="top" className="fullSize">
            <div className="Upload">
                <h1>Create a Post</h1>
                <div className="UploadForm">
                    <input type='text' placeholder='Title...' name='title' value={values.title} onChange={handleChange} /> 
                    <input type="text" placeholder='Author..' name='author' value={values.author} onChange={handleChange} />
                    <textarea name="description" placeholder="Description" value={values.description} onChange={handleChange} ></textarea>
                    <input type='file' onChange={fileSelectChange} />
                    <button onClick={handleSubmit}>Upload</button>
                </div>
                <h1 id="msg">{message}</h1>
            </div>
        </div>
    );
};

export default UploadArtWork; 