import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";

import backendURL from "../global";

function DocumentsSection() {
    const [documents, SetDocuments] = useState([]);
    const [displayedDocuments, SetDisplayedDocuments] = useState([]);
    const [searchInput, SetSearchInput] = useState("");
    const [message, SetMessage] = useState("");

    function getDocuments () {
        axios.get(`${backendURL}/documents`).then((response) => {
            SetDocuments(response.data);
            SetDisplayedDocuments(response.data);
            SetSearchInput("");
        })
    };

    function filterDocuments (filterValue) {
        const filtered = documents.filter(document => document.name.startsWith(filterValue));
        SetDisplayedDocuments(filtered);
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
            <div>
                <input type="text" placeholder="Cerca documents..." value={searchInput} onChange={(e) => {
                    SetSearchInput(e.target.value)
                    filterDocuments(e.target.value)
                }}></input>
            </div>
            <p style={{color: "green"}}>{message}</p>
            {displayedDocuments.map((item, index) => {
                return (
                    <p>{item.name}</p>
                );
            })}
        </>
    );
};

export default DocumentsSection;