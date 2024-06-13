import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createMessage, destroyMessage, fetchMessages, updateMessage } from '../../store/messageReducer';
import Hashtag from '../../assets/channel.png';
import EditMsg from '../../assets/editmessage.png';
import TrashCan from "../../assets/deleteserver.png";
import './Content.css';
import { deleteMessage } from '../../utils/messageApiUtils';
import consumer from '../../../utils/consumer';

const Content = () => {
    const dispatch = useDispatch();
    const { serverId, channelId } = useParams();
    const sessionUser = useSelector(state => state.session?.id);
    const channelName = useSelector(state => channelId ? state.channel[channelId]?.name : null);
    const channelMessages = useSelector(state => state.message);
    const messagesArray = Object.values(channelMessages);

    const [message, setMessage] = useState({ content: '', user_id: sessionUser, channel_id: channelId });
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const editInputRef = useRef(null);

    useEffect(() => {
        if (editingId && editInputRef.current) {
          editInputRef.current.focus();
        }
      }, [editingId]);

    useEffect(() => {
        const sub = consumer.subscriptions.create({ 
            channel: 'ChannelsChannel',
            channelId: channelId
        }, 
        {
            received(message) {
                dispatch(createMessage(message))
            }
        });
        if (channelId) {
            dispatch(fetchMessages(channelId));
        }
        return () => consumer.subscriptions.remove(sub);
    }, [channelId, dispatch]);

    const handleSubmit = e => {
        e.preventDefault();
        if (!message.content.trim()) return;
        dispatch(createMessage(message))
            .then(() => setMessage({ ...message, content: '' }))
            .catch(async res => {
                let data = await res.json();
                if (data.errors) console.error(data.errors);
            });
    };

    const handleEdit = (message) => {
        setEditingId(message.id);
        setEditContent(message.content);
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') {
            handleUpdate(e, id);
        }
    };

    const handleUpdate = (e, id) => {
        e.preventDefault();
        if (!editContent.trim()) return;
        dispatch(updateMessage({ id, content: editContent }))
            .then(() => setEditingId(null));
    };

    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const DateDivider = ({ date }) => (
        <div className="new-date-divider"><span>{date}</span></div>
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
                                    {messagesArray.map((message) => {
                                        const messageDate = formatDate(message.createdAt);
                                        const dateDivider = messageDate !== lastDate ? <DateDivider date={messageDate} /> : null;
                                        lastDate = messageDate;
                                        return (
                                            <React.Fragment key={message.id}>
                                                {dateDivider}
                                                <li className={`message ${message.userId === sessionUser ? "own-message" : ""}`}>
                                                    <div className="message-wrapper">
                                                        <div className="message-contents">
                                                            <div className="message-time-user">
                                                                <h3 className="message-time">{message.time}</h3>
                                                                <h3 className="message-author">{message.author}</h3>
                                                            </div>
                                                            <div className="message-body">
                                                                {editingId === message.id ? (
                                                                    <input type="text"
                                                                        className="edit-input"
                                                                        ref={editInputRef}
                                                                        value={editContent}
                                                                        onChange={(e) => setEditContent(e.target.value)}
                                                                        onBlur={(e) => handleUpdate(e, message.id)}
                                                                        onKeyDown={(e) => handleKeyDown(e, message.id)}
                                                                    />
                                                                ) : (
                                                                    <span>{message.content}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {message.userId === sessionUser && (
                                                        <div className="message-button-container">
                                                            <div className="message-buttons">
                                                                <div className="edit-message" onClick={() => handleEdit(message)}>
                                                                    <img src={EditMsg} className="edit-msg"/>
                                                                </div>
                                                                <div className="delete-message" onClick={() => dispatch(destroyMessage(message))}>
                                                                    <img src={TrashCan} className="del-msg"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
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
    );
};

export default Content;
