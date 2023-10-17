import React from "react";
import * as PiIcons from 'react-icons/pi'

function ChatPage () {
    return (
        <>
            <div className="chat-container">

            </div>
            <div className="chat-footer">
                <input className="chat-footer-input" type="text" placeholder="Ask anything..."></input>
                <button className="chat-footer-button"><PiIcons.PiPaperPlaneTilt />Ask</button>
            </div>
        </>
    );
};

export default ChatPage;