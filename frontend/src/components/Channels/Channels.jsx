import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { destroyChannel, fetchChannels } from '../../store/channelReducer';
import { useDispatch, useSelector } from "react-redux";
import AddChannel from "../../assets/addchannel.png";
import ChannelHashtag from "../../assets/channel.png";
import ChannelForm from '../ChannelForm/ChannelForm';
import Gear from "../../assets/gear.png";
import TrashCan from "../../assets/delete.png";
import './Channels.css'

const Channels = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { serverId } = useParams();
    const sessionId = useSelector(state => state.session?.id);
    const ownerId = useSelector(state => state.server[serverId]?.ownerId)

    const channels = useSelector(state => state.channel);
    const channelsArray = Object.values(channels);
=
    const [activeLink , setActiveLink] = useState(() => {
        const generalChannel = channelsArray.find(channel => channel.name === 'general');
        return generalChannel ? generalChannel.id : null;
    });

    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [showChannelForm, setShowChannelForm] = useState(false);

    const isOwner = (sessionId === ownerId);

    useEffect(() => {
        if (serverId) dispatch(fetchChannels(serverId))
    }, [serverId, dispatch])

    const handleDeleteChannel = (channel) => {
        dispatch(destroyChannel(channel))
            .then(() => {
                const generalChannelId = channelsArray.find(ch => ch.name === 'general')?.id;
                if (generalChannelId) {
                    navigate(`/channels/${serverId}/${generalChannelId}`);
                }
            })
            .catch(error => {
                console.error("Failed to delete channel:", error);
            });
    };

    return (
        <>
            <div className='channel-content'>
                <ul className='channels-list'>
                    <li className='text-channels-container'>
                        <div className='text-channels-content'>
                            <div className='text-channels-header-text'>
                                <h3>TEXT CHANNELS</h3>
                            </div>
                            {isOwner &&
                                <div className='text-channel-add'>
                                    <img className="channel-icons" src={AddChannel} alt="plus sign" 
                                        onClick={() => {setShowChannelForm(true); setIsUpdateMode(false);}}
                                    />
                                </div>
                            }
                        </div>
                    </li>
                    {channelsArray.map(channel => (
                        <li key={channel.id} className={`channel-container-list ${activeLink === channel.id ? 'active' : ''}`} 
                        onClick={() => setActiveLink(channel.id)}
                        >
                            <div className='channel-container'>
                                <Link key={channel.id} to={`/channels/${serverId}/${channel.id}`} className='channel'>
                                    <div className='channel-hashtag'>
                                        <img className="channel-icons" src={ChannelHashtag} alt="hashtag"/>
                                    </div>
                                    <div className='channel-name'>
                                        {channel.name}
                                    </div>
                                    {!(channel.name === 'general') &&
                                        <div className='channel-ud'>
                                            <div className='update-channel'>
                                                <img src={Gear} onClick={() => {setShowChannelForm(true); setIsUpdateMode(true);}} />
                                            </div>
                                            <div className='delete-channel'>
                                                <img src={TrashCan}  onClick={() => handleDeleteChannel(channel)}/>
                                            </div>
                                        </div>
                                    }
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {showChannelForm && 
                <div className='overlay' onClick={() => setShowChannelForm(false)}></div>}
            {showChannelForm && 
                <div className='new-server-container'>
                    <ChannelForm setShowChannelForm={setShowChannelForm} isUpdating={isUpdateMode}/>
                </div>}
        </>
    )
}

export default Channels;
