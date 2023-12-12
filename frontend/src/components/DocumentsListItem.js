import React from "react";
import { Link } from "react-router-dom";
import * as AiIcons from 'react-icons/ai';

function formatDate(dateString) {
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
  return formattedDate;
}

function DocumentsListItem({ name, author, date, type, can_delete, callback }) {
  const formattedDate = formatDate(date);

  return (
    <div className="documents-list-item">
      <Link to={`/home/documents/${name}`} className="documents-list-item-link documents-list-name">
        <p>{name}</p>
      </Link>
      <div className="documents-list-item-info">
        <p className="documents-list-author">{author}</p>
        <p className="documents-list-date">{formattedDate}</p>
        {type !== '' ?
        <p className="documents-list-type"><span className={type == 'public' ? "public-type" : "private-type"}>{type}</span> </p>
        :
        <></>
        }
      </div>
      {can_delete ? (
        <div className="documents-list-item-delete-button" >
          <AiIcons.AiOutlineDelete onClick={() => { callback(name) }}/>
        </div>
      )
      :
      <></>}
    </div>
  );
}

export default DocumentsListItem;
