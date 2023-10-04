import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";

import backendURL from "../global";

function DocumentsSection() {
    const [documents, SetDocuments] = useState([]);
    const [fileToUpload, SetFileToUpload] = useState();
    const [message, SetMessage] = useState("");

    function getDocuments () {
        axios.get(`${backendURL}/documents`).then((response) => {
            SetDocuments(response.data);
        })
    };

    function handleFileSelection (file) {
        let formData = new FormData();
        formData.append("File", file);
        axios.post(`${backendURL}/documents`, formData).then((response) => {
            SetMessage("File uploaded successfully!");
        });

        getDocuments();
    };

    useEffect(() => {
        getDocuments();
    }, []);


    return (
        <>
            <h1>Documents</h1>
            <div>
                <input type="file" onChange={(e) => handleFileSelection(e.target.files[0])}></input>
            </div>
            <p style={{color: "green"}}>{message}</p>
            {documents.map((item, index) => {
                return (
                    <p>{item.name}</p>
                );
            })}
        </>
    );
};

export default DocumentsSection;