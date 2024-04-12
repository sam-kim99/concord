// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from 'react';
// import { useParams } from "react-router-dom";
// import { createMessage, fetchMessages } from "../../store/messageReducer";
// import Hashtag from "../../assets/channel.png"
// import './Content.css'


// const Content = props => {
//     const dispatch = useDispatch();
//     const { serverId, channelId } = useParams();
//     // const [newMessage, setNewMessage] = useState('');

//     const sessionUser = useSelector(state => state.session?.id);

//     const channelName = useSelector(state => channelId ? state.channel[channelId]?.name : null);
//     const channelMessages = useSelector(state => state.message);
//     const messagesArray = Object.values(channelMessages);

//     const [ message, setMessage ] = useState({
//         content: '',
//         user_id: sessionUser,
//         channel_id: channelId
//     });

//     useEffect(() => {
//         if (channelId) dispatch(fetchMessages(channelId))
//     }, [channelId])

//     const handleSubmit = e => {
//         e.preventDefault();
//         dispatch(createMessage(message))
//             .catch(async res => {
//                 let data = await res.json();
//                 if (data.errors) {
//                     setErrors(data)
//                 }
//             })
//     }

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
//     };

//     const DateDivider = ({ date }) => (
//         <div className="new-date-divider">
//           {date}
//         </div>
//     );
    
//     let lastDate = null;

//     return (
//         <>
//             <div className="chat-container">
//                 <div className="chat-header">
//                     <div className="chat-header-text">
//                         <div className="channel-hashtag">
//                             <img src={Hashtag} className="message-hashtag"/>
//                         </div>
//                         <div className="channel-name">
//                             <h1>{channelName}</h1>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="chat-content">
//                     <div className="message-wrapper">
//                         <div className="messages-scroll">
//                             <div className="scroller-content">
//                                 <ol className="messages-list">
//                                     <div className="new-date-divider">

//                                     </div>
//                                     {messagesArray.map(message => (
//                                         <li key={message.id} className="message">
//                                             <div className="message-wrapper">
//                                                 <div className="message-contents">
//                                                     <h3 className="message-time-user">
//                                                         {message.time}
//                                                     </h3>
//                                                     <div className="message-body">
//                                                         {message.content}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="message-button-container">
//                                                 <div className="message-buttons">
//                                                     <div className="edit-message">

//                                                     </div>
//                                                     <div className="delete-message">

//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </li>
//                                     ))}
//                                 </ol>
//                             </div>
//                         </div>
//                     </div>
//                     <form className="message-form" onSubmit={handleSubmit}>
//                         <div className="channel-text-area">
//                             <div className="text-scrollable">
//                                 <div className="form-input">
//                                     <div className="msg-text-area">
//                                         <input type="text" 
//                                             name="message"
//                                             placeholder={`Message #${channelName}`}
//                                             onChange={(e) => setMessage({ ...message, content: e.target.value})}
//                                             // onKeyDown={(e) => {
//                                             //     if (e.key === 'Enter' && !e.shiftKey) {
//                                             //         handleSubmit(e);
//                                             //     }
//                                             // }}
//                                         />
//                                         <button type="submit">Send</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Content;

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { createMessage, fetchMessages } from "../../store/messageReducer";
import Hashtag from "../../assets/channel.png"
import './Content.css'


const Content = props => {
    const dispatch = useDispatch();
    const { serverId, channelId } = useParams();

    const sessionUser = useSelector(state => state.session?.id);
    const channelName = useSelector(state => channelId ? state.channel[channelId]?.name : null);
    const channelMessages = useSelector(state => state.message);
    const messagesArray = Object.values(channelMessages);

    const [message, setMessage] = useState({
        content: '',
        user_id: sessionUser,
        channel_id: channelId
    });

    useEffect(() => {
        if (channelId) dispatch(fetchMessages(channelId));
    }, [channelId, dispatch]);

    const handleSubmit = e => {
        e.preventDefault();
        if (!message.content.trim()) return;
        dispatch(createMessage(message))
            .then(() => {
                setMessage({ ...message, content: '' });
            })
            .catch(async res => {
                let data = await res.json();
                if (data.errors) {
                    console.error(data.errors);
                }
            });
    }

    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const DateDivider = ({ date }) => (
        <div className="new-date-divider">
            <span>{date}</span>
        </div>
    );

    let lastDate = null;

    return (
        <>
            <div className="chat-container">
                <div className="chat-header">
                    <div className="chat-header-text">
                        <div className="channel-hashtag">
                            <img src={Hashtag} className="message-hashtag"/>
                        </div>
                        <div className="channel-name-header">
                            <h1>{channelName}</h1>
                        </div>
                    </div>
                </div>
                <div className="chat-content">
                    <div className="message-wrapper">
                        <div className="messages-scroll">
                            <div className="scroller-content">
                                <ol className="messages-list">
                                    {messagesArray.map((message, index) => {
                                        const messageDate = formatDate(message.createdAt); // assuming message has createdAt field
                                        const dateDivider = messageDate !== lastDate ? <DateDivider date={messageDate} /> : null;
                                        lastDate = messageDate; 
                                        return (
                                            <React.Fragment key={message.id}>
                                                {dateDivider}
                                                <li className="message">
                                                    <div className="message-wrapper">
                                                        <div className="message-contents">
                                                            <div className="message-time-user">
                                                                <h3 className="message-time">
                                                                    {message.time}
                                                                </h3>
                                                                <h3 className="message-author">
                                                                    {message.author}
                                                                </h3>
                                                            </div>

                                                            <div className="message-body">
                                                                {message.content}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="message-button-container">
                                                        <div className="message-buttons">
                                                            <div className="edit-message">

                                                            </div>
                                                            <div className="delete-message">

                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </React.Fragment>
                                        );
                                    })}
                                </ol>
                            </div>
                        </div>
                    </div>
                    <div className="message-spacer"></div>
                    <form className="message-form" onSubmit={handleSubmit}>
                        <div className="channel-text-area">
                            <div className="text-scrollable">
                                <div className="form-input">
                                    <div className="msg-text-area">
                                        <input type="text"
                                            className="message-text-input"
                                            name="message"
                                            value={message.content}
                                            placeholder={`Message #${channelName}`}
                                            onChange={(e) => setMessage({ ...message, content: e.target.value })}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    handleSubmit(e);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
        )
    }

    export default Content;