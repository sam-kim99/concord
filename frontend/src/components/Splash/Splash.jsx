import { Link } from 'react-router-dom'
import SplashBckgnd from '../../assets/bg.png'
import NavBar from '../NavBar/NavBar'
import './Splash.css'

const Splash = props => {
    return (
        <>
            <div className="splash-page">
                <NavBar />
                <div className="splash-bg">
                    <img className="splash-bg-img" src={SplashBckgnd} alt="Splash Background" />
                </div>
                <div className="splash-content-container">
                    <div className="splash-content">
                        <div className='splash-content-header'>
                            <h1>IMAGINE A PLACE...</h1>
                        </div>
                        <div className='splash-content-body'>
                            <p>...where you belong to a school club, a gaming group, or an intense coding bootcamp. Where just you and a handful of friends can spend time together in peace and concord. A place that makes it easy to talk every day and hang out more often.</p>
                        </div>
                        <div className='splash-content-end'>
                            <h2>THIS IS CONCORD.</h2>
                        </div>
                        <div className='splash-content-start'>
                            <Link to="/login" className='splash-content-start-button'>Get Started with Concord</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Splash;