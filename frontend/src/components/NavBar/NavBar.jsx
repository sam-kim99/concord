import SplashLogo from '../../assets/icon.png'
import GithubLogo from '../../assets/github-mark-white.png'
import LinkedInLogo from '../../assets/linkedin.png'
import './NavBar.css'

const NavBar = ({ specialClass }) => {
    return (
        <>
            <div className="splash-nav">
                <div className='splash-logo'>
                    <a className={ specialClass } href="/">
                        <img className= "splash-logo-img" src={SplashLogo} alt="Logo" />
                        <h2>Concord</h2>
                    </a>
                </div>
                <div className='splash-links'>
                    <a className={ specialClass } href="https://github.com/sam-kim99">
                        <img className= "nav-img" src={GithubLogo} alt="Github Logo" />
                    </a>
                    <a className={ specialClass } href="https://www.linkedin.com/in/samuel-kim-b8460b225/">
                        <img className= "nav-img" src={LinkedInLogo} alt="Github Logo" />
                    </a>
                </div>
                <div className={`splash-login ${ specialClass }`}>
                    <a className= "splash-login-button" href="/login">
                        Login
                    </a>
                </div>
            </div>
        </>
    )
}

export default NavBar;