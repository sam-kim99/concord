import SplashLogo from '../../assets/icon.png'
import GithubLogo from '../../assets/github-mark-white.png'
import LinkedInLogo from '../../assets/linkedin.png'
import { useSelector } from 'react-redux'
import './NavBar.css'
import { Link } from 'react-router-dom'

const NavBar = ({ specialClass }) => {
    const sessionUser = useSelector(state => state.session?.username);

    const buttonText = sessionUser ? 'Open Concord' : 'Login';
    const buttonLink = sessionUser ? '/channels/@me' : '/login';

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
                    <Link className="splash-login-button" to={buttonLink} >{buttonText}</Link>
                </div>
            </div>
        </>
    )
}

export default NavBar;