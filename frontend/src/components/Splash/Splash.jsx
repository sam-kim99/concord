import SplashBckgnd from '../../assets/bg.png'
import SplashLogo from '../../assets/icon.png'
import GithubLogo from '../../assets/github-mark-white.png'
import LinkedInLogo from '../../assets/linkedin.png'
import './Splash.css'

const Splash = props => {
    return (
        <>
            <div className="splash-page">
                <div className="splash-nav">
                    <div className='splash-logo'>
                        <a href="/">
                            <img className="splash-logo-img" src={SplashLogo} alt="Logo" />
                            <h2>Concord</h2>
                        </a>
                    </div>
                    <div className='splash-links'>
                        <a href="https://github.com/sam-kim99">
                            <img className="nav-img" src={GithubLogo} alt="Github Logo" />
                        </a>
                        <a href="https://www.linkedin.com/in/samuel-kim-b8460b225/">
                            <img className="nav-img" src={LinkedInLogo} alt="Github Logo" />
                        </a>
                    </div>
                    <div className='splash-login'>
                        <a className='splash-login-button' href="/login">
                            Login
                        </a>
                    </div>
                </div>
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
                    </div>
                </div>
            </div>
        </>

    )
}

export default Splash;