import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { logoutUser } from '../../store/sessionReducer';
import './MainPage.css'

const MainPage = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const sessionUser = useSelector(state => state.session?.username);

    useEffect(() => {
        if (!sessionUser) navigate('/login');
    }, [sessionUser, navigate])

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
            <div className='main-page-container'>
                <div className='server-list'>

                </div>
                <div className='friends-list'>

                </div>
                <div className='main-content'>

                </div>
                <div className='adtl-info'>

                </div>
            </div>
            <h1>Welcome to the main page.</h1>
            <button onClick={handleSignout}>Sign Out</button>
        </>
    )
}

export default MainPage;