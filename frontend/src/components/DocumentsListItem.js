import React from "react";
import { Link } from "react-router-dom";

function DocumentsListItem ({name}) {
    return (
        <Link to="/" className="documents-list-item">
            {name}
        </Link>
    );
};

export default DocumentsListItem;