import React, { useState } from "react";

import axios from "axios";
import backendURL from "../global";

function NewFileForm ({callback}) {

    const [selectedFile, setSelectedFile] = useState(null);
    const [privateFile, setPrivateFile] = useState(false);
    const [message, setMessage] = useState('');

    async function handleFileSelection () {
        if(selectedFile == null) {
            setMessage("No file selected");
        } else {
            let formData = new FormData();
            formData.append("File", selectedFile);
            formData.append("Type", privateFile);
            await axios.post(`${backendURL}/documents`, formData, {withCredentials: true}).then((response) => {
                callback();
            });
        }
        
    };

    return (
        <div className="new-file-form">
            <div className="new-file-form-inputs">
                <input type="file" id="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <div>
                    <input type="checkbox" id="type" value={privateFile} onClick={() => setPrivateFile(!privateFile)} />
                    <label className="new-file-form-label" for="type">Private File</label>
                </div>
            </div>
            <button className="new-file-form-button" onClick={handleFileSelection}>Upload</button>
            {message}
        </div>
    );
};

export default NewFileForm;