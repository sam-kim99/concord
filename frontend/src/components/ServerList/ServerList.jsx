import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchServers } from "../../store/serverReducer";
import DiscordLogo from "../../assets/discordicon.svg";
import ServerForm from '../ServerForm/ServerForm';
import "./ServerList.css";
import { fetchChannels } from '../../store/channelReducer';

const ServerList = () => {
    const dispatch = useDispatch();
    const { serverId } = useParams();
    const sessionUser = useSelector(state => state.session?.username);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (sessionUser) {
            dispatch(fetchServers())
        }
    }, [sessionUser, dispatch]);

    useEffect(() => {
        if (serverId) {
            dispatch(fetchChannels(serverId));
        }
    }, [serverId, dispatch]);

    const servers = useSelector(state => state.server);
    const serversArray = Object.values(servers);
    const [activeLink, setActiveLink] = useState(0)

    return (
        <>
            <div className='server channel-me'>
                <Link to={'/channels/@me'} className={`link ${activeLink === 0 ? 'active' : ''}`} 
                onClick={() => setActiveLink(0)}>
                    <img src={DiscordLogo} alt="Discord Logo" />
                </Link>
            </div>
            <div className='divider'>
                <hr></hr>
            </div>
            {serversArray.map(server => (
                <div key={server.id} className='server'>
                    <Link to={`/channels/${server.id}/${server.channels[0]}`} 
                        className={`link ${activeLink === server.id ? 'active' : ''}`} 
                        onClick={() => setActiveLink(server.id)}>
                        {server.name.charAt(0)}
                    </Link>
                </div>
            ))}
            <div className="link new" onClick={() => setShowModal(true)}>+</div>
            {showModal && <div className='overlay' onClick={() => setShowModal(false)}></div>}
            {showModal && <div className='new-server-container'><ServerForm setShowModal={setShowModal} isUpdating={false}/></div>}
        </>
    )
}

export default ServerList;
