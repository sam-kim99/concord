import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createServer, updateServer } from "../../store/serverReducer";
import CloseButton from "../../assets/closebutton.svg";
import './ServerForm.css'

const ServerForm = ({ setShowModal, isUpdating }) => {
    const dispatch = useDispatch();
    const { serverId } = useParams();
    const formRef = useRef();
    
    const currentSession = useSelector(state => state.session);
    const currentServer = useSelector(state => state.server[serverId]);

    const [ server, setServer ] = useState({
        id: serverId,
        name: '',
        owner_id: currentSession.id
    })

    const [ errors, setErrors ] = useState({
        errors: ''
    })

    useEffect(() => {
        if (currentServer) {
            setServer({ ...server, name: currentServer.name });
        }
    }, [currentServer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            let dispatchPromise;
            if (isUpdating) {
                dispatchPromise = dispatch(updateServer(server));
            } else {
                dispatchPromise = dispatch(createServer(server));
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
    

    return(
        <>
            <div className="new-server-modal">
                <div className="new-server-header">
                    <h1>{isUpdating ? 'Update Your Server' : 'Customize Your Server'}</h1>
                    <div className="new-server-subheader">
                        <p>{isUpdating
                                ? 'Changed your mind? No problem! You can always change it later.'
                                : 'Give your new server a personality with a name and an icon. You can always change it later.'
                        }
                        </p>
                    </div>
                    <button className="close-button" type="button" onClick={() => setShowModal(false)}>
                        <div className="button-content">
                            <img className="button-img" src={CloseButton} alt="close-button" />
                        </div>
                    </button>
                </div>
                <div className="placeholder"></div>
                <div className="new-server-form">
                    <form id="myForm" className="create-server" onSubmit={handleSubmit} ref={formRef}>
                        <div className="server-name-input-container">
                            <h1>SERVER NAME</h1>
                            <div className="input-wrapper">
                                <input className="name-input" type="text" maxLength="100" 
                                value={server.name} 
                                onChange={(e) => setServer({ ...server, name: e.target.value })}/>
                            </div>
                        </div>
                        <div className="guidelines">
                            <p>By {isUpdating ? 'updating' : 'creating'} a server, you agree to Discord's <a className ="guidelines-link" href="//discord.com/guidelines">Community Guidelines</a>.</p>
                        </div>
                    </form>
                </div>
                <div className="new-server-footer">
                    <button form="myForm" className="create-button" type="submit">
                        <div className="button-contents">
                            {isUpdating ? 'Update' : 'Create'}
                        </div>
                    </button>
                </div>
            </div>
        </>
    )
}

export default ServerForm;