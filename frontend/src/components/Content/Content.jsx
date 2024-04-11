import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './Content.css'
import { fetchMessages } from "../../store/messageReducer";

const Content = props => {
    const dispatch = useDispatch();
    const { serverId, channelId } = useParams();

    const channelMessages = useSelector(state => state.message)

    useEffect(() => {
        if (channelId) dispatch(fetchMessages(channelId))
    }, [channelId])

    return (
        <>
            <h1>I am the main content</h1>
        </>
    )
}

export default Content;