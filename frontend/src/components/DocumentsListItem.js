import React from "react";
import { Link } from "react-router-dom";
import * as AiIcons from 'react-icons/ai';

function DocumentsListItem ({name, callback}) {

    return (
        <div className="documents-list-item">
            <Link to={`/documents/${name}`} className="documents-list-item-link">
                <p>{name}</p>
            </Link>
            <div className="documents-list-item-delete-button" onClick={() => {callback(name)}}>
                <AiIcons.AiOutlineDelete />
            </div>
        </div>
    );
};

export default DocumentsListItem;