import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { destroyChannel, fetchChannels } from '../../store/channelReducer';
import { useDispatch, useSelector } from "react-redux";
import AddChannel from "../../assets/addchannel.png";
import ChannelHashtag from "../../assets/channel.png";
import ChannelForm from '../ChannelForm/ChannelForm';
import Gear from "../../assets/gear.png";
import TrashCan from "../../assets/delete.png";
import './Channels.css'

const Channels = props => {
    const dispatch = useDispatch();
    const { serverId } = useParams();

    const channels = useSelector(state => state.channel);
    const channelsArray = Object.values(channels);
    const [activeLink , setActiveLink] = useState(0);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (serverId) dispatch(fetchChannels(serverId))
    }, [serverId])

    return (
        <>
            <div className='channel-content'>
                <ul className='channels-list'>
                    <li className='text-channels-container'>
                        <div className='text-channels-content'>
                            <div className='text-channels-header-text'>
                                <h3>TEXT CHANNELS</h3>
                            </div>
                            <div className='text-channel-add'>
                                <img className="channel-icons" src={AddChannel} alt="plus sign" 
                                    onClick={() => {setShowModal(true); setIsUpdateMode(false);}}
                                />
                            </div>
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
                                    <div className='channel-ud'>
                                        <div className='update-channel'>
                                            <img src={Gear} onClick={() => {setShowModal(true); setIsUpdateMode(true);}} />
                                        </div>
                                        <div className='delete-channel'>
                                            <img src={TrashCan}  onClick={() => dispatch(destroyChannel(channel)) }/>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {showModal && <div className='overlay' onClick={() => setShowModal(false)}></div>}
            {showModal && <div className='new-server-container'><ChannelForm setShowModal={setShowModal} isUpdating={isUpdateMode}/></div>}
        </>
    )
}

export default Channels;
