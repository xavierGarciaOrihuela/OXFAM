import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import * as AiIcons from 'react-icons/ai';

import DocumentsListItem from "./DocumentsListItem";

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

    function handleDeleteDocument(documentName) {
        axios.delete(`${backendURL}/documents/${documentName}`);
        SetMessage('File deleted successfully!');
        // Això, en lloc de fer-ho amb .filter() que és O(N), caldria fer-ho amb una cerca binaria per Documents i agafant l'index a DisplayedDocuments
        // Com això és un prototipus i no estarem treballant amb molts documents, no notarem molt el temps d'execució d'això, però si s'escala l'aplicació, és un dels punts que més afectarà l'eficiència.
        SetDisplayedDocuments(displayedDocuments.filter((document) => document.name !== documentName));
        SetDocuments(documents.filter((document) => document.name !== documentName));
    };

    function filterDocuments (filterValue) {
        const lowerCaseValue = filterValue.toLowerCase();
        const filtered = documents.filter(document => document.name.toLowerCase().startsWith(lowerCaseValue));
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
            <div className="documents-header">
                <div className="documents-search-bar">
                    <input className="documents-search-bar-input" type="text" placeholder="Search documents..." value={searchInput} onChange={(e) => {
                        SetSearchInput(e.target.value)
                        filterDocuments(e.target.value)
                    }}></input>
                    <AiIcons.AiOutlineSearch />
                </div>
                <div className="documents-upload-button">
                    <input type="file" id="file" onChange={(e) => handleFileSelection(e.target.files[0])} hidden/>
                    <label for="file" className="documents-upload-button-text"><span><AiIcons.AiOutlineUpload/> New file</span></label>
                </div>
            </div>
            
            <p style={{color: "green"}}>{message}</p>
            <div className="documents-list">
                {displayedDocuments.map((item, index) => {
                    return (
                        <DocumentsListItem name={item.name} callback={handleDeleteDocument}></DocumentsListItem>
                    );
                })}
            </div>
        </>
    );
};

export default DocumentsSection;