import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import * as AiIcons from 'react-icons/ai';

import ChatPage from "./ChatPage";

import backendURL from "../global";

function DocumentPage () {
    const [documentURL, setDocumentURL] = useState();
    const [message, setMessage] = useState('');
    let { name } = useParams();
    const [activeChat, setActiveChat] = useState(true);

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
                    <Link to={"/documents"}> Return to the documents list</Link>
                    <p>{message}</p>
                    <h1>{name}</h1>
                </div>
                <button onClick={() => setActiveChat(!activeChat)}>{activeChat ? <AiIcons.AiOutlineEyeInvisible /> : <AiIcons.AiOutlineEye />}{activeChat ? 'Close chat' : 'Open chat'}</button>
            </div>
            <div className="document-main">
                <object className="document-viewer" data={documentURL} type="application/pdf">

                </object>
                {activeChat ? 
                <div className="single-document-chat">
                <ChatPage />
                </div>
                :
                <></>}
            </div>
        </>
    );
}

export default DocumentPage;