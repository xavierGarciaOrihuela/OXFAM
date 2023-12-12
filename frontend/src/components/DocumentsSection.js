import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import * as AiIcons from 'react-icons/ai';

import DocumentsListItem from "./DocumentsListItem";
import NewFileForm from "./NewFIleForm";

import backendURL from "../global";

function DocumentsSection() {
    const [documents, SetDocuments] = useState([]);
    const [displayedDocuments, SetDisplayedDocuments] = useState([]);
    const [searchInput, SetSearchInput] = useState("");
    const [message, SetMessage] = useState("");
    const [showNewFileForm, SetShowNewFileForm] = useState(false);

    function getDocuments () {
        axios.get(`${backendURL}/documents`, {withCredentials: true}).then((response) => {
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

    function UploadFileCallback() {
        SetShowNewFileForm(false);
        SetMessage("File uploaded successfully!");
        getDocuments();
    }

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
                    <button className="documents-upload-button-button" onClick={() => SetShowNewFileForm(!showNewFileForm)}><span className="documents-upload-button-text"><AiIcons.AiOutlineUpload/> New file</span></button>
                    {showNewFileForm ?
                    <div className="new-file-form-popup">
                        <NewFileForm callback={UploadFileCallback} />
                    </div>
                    :
                    <></>
                    }
                </div>
            </div>
            
            <p style={{color: "green"}}>{message}</p>
            <div className="documents-list-table-headers">
                <p className="documents-list-name">Name</p>
                <p className="documents-list-author">Author</p>
                <p className="documents-list-date">Date</p>
            </div>
            <div className="documents-list">
                {displayedDocuments.map((item, index) => {
                    return (
                        <DocumentsListItem name={item.name} author={item.author} date={item.date} type= {item.type} can_delete={item.can_delete} callback={handleDeleteDocument}></DocumentsListItem>
                    );
                })}
            </div>
        </>
    );
};

export default DocumentsSection;