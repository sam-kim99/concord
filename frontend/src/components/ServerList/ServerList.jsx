import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchServers } from "../../store/serverReducer";
import DiscordLogo from "../../assets/discordicon.svg";
import ServerForm from '../ServerForm/ServerForm';
import "./ServerList.css";

const ServerList = props => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session?.username);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (sessionUser) dispatch(fetchServers())
    }, [sessionUser])


    const servers = useSelector(state => state.server);

    const serversArray = Object.values(servers);
    const [activeLink, setActiveLink] = useState(0)


    return (
        <>
            <div className='server channel-me'>
                <Link to={'/channels/@me'} className={`link ${activeLink === 0 ? 'active' : ''}`} 
                onClick={() => setActiveLink(0)}>
                    <img src={DiscordLogo} />
                </Link>
            </div>
            <div className='divider'>
                <hr></hr>
            </div>
            {serversArray.map(server => (
                <div key={server.id} className='server'>
                    <Link key={server.id} to={`/channels/${server.id}`} 
                    className={`link ${activeLink === server.id ? 'active' : ''}`} onClick={() => setActiveLink(server.id)}>
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
