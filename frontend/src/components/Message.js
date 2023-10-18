import React from "react";
import { Link } from "react-router-dom";

function Message ({message}) {
    const messageClassName = 'message ' + (message.origin === "User" ? 'user-message' : 'computer-message');
    return (
        <div className={messageClassName}>
            <p>{message.content}</p>
            {message.origin === "Computer" && message.sources.length > 0 ? 
            <>
                <p>Fonts:</p>
                {message.sources.map((source, index) => {
                    return (
                        <p><Link key={index} to={`/documents/${source}`} target="_blank">· {source}</Link></p>
                    );
                })}
            </> : 
            <></>}
        </div>
    );
};

export default Message;