import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createChannel, updateChannel } from "../../store/channelReducer";
import ChannelHashtag from "../../assets/channel.png";
import CloseButton from "../../assets/closebutton.svg";
import './ChannelForm.css';

const ChannelForm = ({ setShowModal, isUpdating }) => {
    const dispatch = useDispatch();
    const { serverId, channelId } = useParams();
    const formRef = useRef();

    const currentChannel = useSelector(state => state.channel[channelId])

    const [ channel, setChannel ] = useState({
        id: channelId,
        name: '',
        server_id: serverId
    })

    const [ errors, setErrors ] = useState({
        errors: ''
    })

    useEffect(() => {
        if (currentChannel) {
            setChannel({ ...channel, name: currentChannel.name });
        }
    }, [currentChannel]);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            let dispatchPromise;
            if (isUpdating) {
                dispatchPromise = dispatch(updateChannel(channel));
            } else {
                dispatchPromise = dispatch(createChannel(channel));
            }
            dispatchPromise.then(() => setShowModal(false))
                           .catch((error) => {
                               if (error.response && error.response.data.errors) {
                                   setErrors(error.response.data.errors);
                               } else {
                                   console.error('An error occurred:', error);
                               }
                           });
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    return (
        <>
            <div className="channel-modal">
                <div className="channel-header">
                    <div className="channel-text">
                        <h1>Create Channel</h1>
                        <div className="channel-subheader">
                            <h3>in Text Channels</h3>
                        </div>
                    </div>
                    <button className="close-button" type="button" onClick={() => setShowModal(false)}>
                        <div className="channel-close">
                            <img className="button-img" src={CloseButton} alt="close-button" />
                        </div>
                    </button>
                </div>
                <div className="channel-body">
                    <div className="channel-form">
                        <form id="channel-form" onSubmit={handleSubmit} ref={formRef}>
                            <label className="channel-form-header">
                                CHANNEL NAME
                            </label>
                            <div className="channel-form-field">
                                <img src={ChannelHashtag} />
                                <input className="channel-name-input" type="text" maxLength="100"
                                placeholder="new-channel"
                                onChange={(e) => setChannel({ ...channel, name: e.target.value})}
                                />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="channel-footer">
                    <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="channel-submit" form="channel-form">Create Channel</button>
                </div>
            </div>
        </>
    )
}

export default ChannelForm;