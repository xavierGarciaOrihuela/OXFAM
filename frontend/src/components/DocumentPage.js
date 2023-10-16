import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import backendURL from "../global";

function DocumentPage () {
    const [documentURL, setDocumentURL] = useState();
    const [message, setMessage] = useState('');
    let { name } = useParams();

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
            <div>
                <Link to={"/documents"}> Return to the documents list</Link>
                <p>{message}</p>
                <h1>{name}</h1>
            </div>
            <object className="document-viewer" data={documentURL} type="application/pdf">

            </object>
        </>
    );
}

export default DocumentPage;