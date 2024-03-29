import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import * as AiIcons from 'react-icons/ai';

import SingleDocumentChat from "./SIngleDocumentChat";

import backendURL from "../global";

function DocumentPage () {
    const [documentURL, setDocumentURL] = useState();
    const [message, setMessage] = useState('');
    let { name } = useParams();
    const [activeChat, setActiveChat] = useState(false);
    const [infographicsButtonName,setInfographicsButtonName] = useState('Infographic');

    function handleInfographicsDownload () {
        setInfographicsButtonName('Generating');
        axios.post(`${backendURL}/documents/${name}/infographic`)
            .then((response) => {
                setInfographicsButtonName('Infographic');
                window.open(response.data.url, '_blank', 'noreferrer');
            })
            .catch()
    };  

    useEffect(() => {
        
        axios(`${backendURL}/documents/${name}` , {
            method: 'GET',
            responseType: 'blob' //Force to receive data in a Blob Format
        }).then((response) => {
            const blob = new Blob([response.data], { type: 'application/pdf; charset=utf-8' });
            setDocumentURL(URL.createObjectURL(blob));
        }).catch(error => {
            setMessage(error);
        });
    }, []);

    return (
        <>
            <div className="document-header">
                <div>
                    <Link to={"/home/documents"}> Return to the documents list</Link>
                    <p>{message}</p>
                    <h1>{name}</h1>
                </div>
                <div className="document-header-buttons">
                    <button className="document-infographics-button" onClick={() => handleInfographicsDownload()}>{infographicsButtonName}</button>
                    <button className="document-chat-view-button" onClick={() => setActiveChat(!activeChat)}>{activeChat ? <AiIcons.AiOutlineEyeInvisible /> : <AiIcons.AiOutlineEye />}{activeChat ? 'Close chat' : 'Open chat'}</button>
                </div>
            </div>
            <div className="document-main">
                <object className="document-viewer" data={documentURL} type="application/pdf">

                </object>
                {activeChat ? 
                < SingleDocumentChat fileName={name}/>
                :
                <></>}
            </div>
        </>
    );
}

export default DocumentPage;