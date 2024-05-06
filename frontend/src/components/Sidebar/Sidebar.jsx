import { useState } from "react";
import { useParams } from "react-router-dom";
import { destroyServer } from "../../store/serverReducer";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from '../../store/sessionReducer';
import ServerForm from "../ServerForm/ServerForm";
import Dropdown from "../../assets/dropdown.png";
import EditGear from "../../assets/editserver.png";
import CreateChannel from "../../assets/createchannel.png";
import CloseButton from "../../assets/closebutton.png";
import DoorClose from "../../assets/logout.png";
import RedTrash from "../../assets/deleteserver.png";
import Channels from "../Channels/Channels";
import ChannelForm from "../ChannelForm/ChannelForm";
import './Sidebar.css'

const Sidebar = props => {
    const dispatch = useDispatch();
    const { serverId } = useParams();
    const sessionId = useSelector(state => state.session?.id);
    const ownerId = useSelector(state => state.server[serverId]?.ownerId)
    const isOwner = (sessionId === ownerId);
    
    const sessionUser = useSelector(state => state.session?.username);
    const serverName = useSelector(state => state.server[serverId]?.name);

    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showChannelForm, setShowChannelForm] = useState(false);

    const handleSignout = e => {
        e.preventDefault();
        dispatch(logoutUser())
        .catch(async res => {
            let data = await res.json();
            if (data.errors) {
                setErrors(data)
            }
        })
    }

    return (
        <>
            <div className="top-bar">
                <div className="top-bar-dropdown">
                    <div className="top-bar-header" onClick={() =>  setShowDropdown(!showDropdown)}>
                        <div className="server-name">
                            <h1>{serverName ? serverName : 'Welcome back!'}</h1>
                        </div>
                        <div className="dropdown-button">
                            <img className="dropdown-icon" src={showDropdown ? CloseButton : Dropdown} alt="dropdown arrow" />
                        </div>
                    </div>
                </div>
                <div className="channel-container">
                    <Channels />
                </div>
            </div>
            
            {showDropdown && (
                    <div className="dropdown-menu">
                        <div className="dropdown-contents">
                                {isOwner &&
                                    <div>
                                        <div className="dropdown-component-container" onClick={() => setShowModal(true)}>
                                            <div className="inner-text">
                                                <p>Edit Server</p>
                                            </div>
                                            <div className="dropdown-img">
                                                <img src={EditGear}/>
                                            </div>
                                        </div>
                                        <div id="channel-creator" className="dropdown-component-container" onClick={() => setShowChannelForm(true)}>
                                            <div className="inner-text">
                                                <p>Create Channel</p>
                                            </div>
                                            <div className="dropdown-img">
                                                <img src={CreateChannel}/>
                                            </div>
                                        </div>
                                    </div>
                                }
                            {!isOwner &&
                                <div className="dropdown-component-container" >
                                    <div className="inner-text">
                                        <p>Leave Server</p>
                                    </div>
                                    <div className="dropdown-img">
                                        <img src={DoorClose}/>
                                    </div>
                                </div>
                            }
                            {showModal && <div className='overlay' onClick={() => setShowModal(false)}></div>}
                            {showModal && <div className='new-server-container'><ServerForm setShowModal={setShowModal} isUpdating={true}/></div>}
                            {isOwner &&
                                <div className="dropdown-component-container" id="delete-server" onClick={() => dispatch(destroyServer(serverId))}>
                                    <div className="inner-text">
                                        <p>Delete Server</p>
                                    </div>
                                    <div id="delete-server-img" className="dropdown-img">
                                        <img src={RedTrash}/>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
            )}
            {showChannelForm && <div className='overlay' onClick={() => setShowChannelForm(false)}></div>}
            {showChannelForm && <div className='new-server-container'><ChannelForm setShowChannelForm={setShowChannelForm}/></div>}


            <div className="user-info-container">
                <div className="user-info">
                    <p>{sessionUser}</p>
                </div>
                <div className="logout-button" onClick={handleSignout}>
                    <img src={DoorClose} />
                </div>
            </div>
        </>
    )
}

export default Sidebar;