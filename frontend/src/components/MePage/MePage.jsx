import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ServerList from '../ServerList/ServerList';
import Sidebar from '../Sidebar/Sidebar';
import Content from '../Content/Content';
import ExtraInfo from '../ExtraInfo/ExtraInfo';
import "./MePage.css"

const MePage = () => {
    const navigate = useNavigate();

    const sessionUser = useSelector(state => state.session?.username)

    useEffect(() => {
        if (!sessionUser) navigate('/login');
    }, [sessionUser, navigate])

    return (
        <>
            <div className='main-page-container'>
                <div className='server-list'>
                    <ServerList />
                </div>
                <div className='sidebar'> 
                    <Sidebar /> 
                </div>
                <div className='content'>
                    <Content />
                </div>
                <div className='extra-info'>
                    <ExtraInfo />
                </div>
            </div>
        </>
    )
}

export default MePage;