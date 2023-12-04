import React from "react";
import { Link } from "react-router-dom";
import * as AiIcons from 'react-icons/ai';

function formatDate(dateString) {
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
  return formattedDate;
}

function DocumentsListItem({ name, author, date, type, activeuser, callback }) {
  const formattedDate = formatDate(date);

  return (
    <div className="documents-list-item">
      <Link to={`/home/documents/${name}`} className="documents-list-item-link">
        <p>{name}</p>
      </Link>
      <div className="documents-list-item-info">
        <p className="document-author">{author}</p>
        <p className="document-date">{formattedDate}</p>
      </div>
      {type === 'private' && activeuser === author && (
        <div className="documents-list-item-delete-button" onClick={() => { callback(name) }}>
          <AiIcons.AiOutlineDelete />
        </div>
      )}
    </div>
  );
}

export default DocumentsListItem;
