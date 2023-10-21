import React, { useEffect, useState } from "react";
import * as PiIcons from 'react-icons/pi'
import axios from "axios";

import Message from "./Message";

import backendURL from "../global";

function ChatPage () {
    const [messages, setMessages] = useState([]);
    // This one is for error messages
    const [message, setMessage] = useState([]);
    const [question, setQuestion] = useState('');

    /*useEffect(() => {

    }, [])*/

    function addNewMessage (content, origin, sources) {
        setMessages((prevState) => [...prevState, {'content': content, 'origin': origin, 'sources': sources}])
    };

    function handleAskSubmit () {
        if(question !== '') {
            let sentQuestion = question;
            setMessage('');
            setQuestion('');
            addNewMessage(sentQuestion, 'User', []);
            axios.get(`${backendURL}/general_chat?question=${sentQuestion}`).then((response) => {
                addNewMessage(response.data.answer, 'Computer', response.data.sources);
            }).catch((error) => setMessage("Something went wrong. Try again later"));
        } else {
            setMessage('You must provide a question')
        }
        
    };

    return (
        <>
            <div className="chat-container">
                {messages.map((message, index) => {
                    return (
                        <Message key={index} message={message}></Message>
                    );
                })}
            </div>
            <p style={{color: 'red'}}>{message}</p>
            <div className="chat-footer">
                <input className="chat-footer-input" type="text" placeholder="Ask anything..." value={question} onChange={(e) => setQuestion(e.target.value)}></input>
                <button className="chat-footer-button" onClick={handleAskSubmit}><PiIcons.PiPaperPlaneTilt />Ask</button>
            </div>
        </>
    );
};

export default ChatPage;