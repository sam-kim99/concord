import NavBar from '../NavBar/NavBar';
import NoodleGif from '../../assets/discordnoodle.gif'
import './NotFound.css'

const NotFound = props => {
    return (
        <>
            <NavBar specialClass="inverted" />
            <div className='not-found-container'>
                <div className='not-found-content'>
                    <div className='not-found-body'>
                        <div className='not-found-text'>
                            <h1>THIS DOESN'T LOOK RIGHT...</h1>
                        </div>
                        <div className="not-found-p">
                            <p>You look lost, stranger. You know what helps when you’re lost? A piping hot bowl of noodles. Take a seat, we’re frantically at work here cooking up something good. Oh, you need directions? These might help you:</p>
                        </div>
                        <ul className='not-found-link-list'>
                            <li>
                                <a className='not-found-links' href="/">Welcome Way</a>
                            </li>
                            <li>
                                <a className='not-found-links' href="/login">Login Lane</a>
                            </li>
                            <li>
                                <a className='not-found-links' href="/register">Register Road</a>
                            </li>
                        </ul>
                    </div>
                    <div className='not-found-gif'>
                        <img src={NoodleGif} alt="Not Found Gif" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotFound;