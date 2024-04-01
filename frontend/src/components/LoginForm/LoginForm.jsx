import { useState } from "react";
import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
import { loginUser } from "../../store/sessionReducer";
import HomeBckgnd from '../../assets/bg.png'
import './LoginForm.css'


const LoginForm = props => {
    const dispatch = useDispatch();

    const [ user, setUser ] = useState({
        credential: '',
        password: ''
    });

    const [ errors, setErrors ] = useState(null);

    const { credential, password } = user;

    const handleSubmit = async (e) => { 
        e.preventDefault();
        try {
            await dispatch(loginUser(user));
        } catch (error) {
            setErrors(error.errors); 
        }
    };

    const handleDemo = async (e) => {
        e.preventDefault();
        let demoUser;
        if (e.target.value === '1') {
            demoUser = {
                credential: 'testuser1',
                password: 'password'
            };
        } else {
            demoUser = {
                credential: 'testuser2',
                password: 'password'
            };
        }
        try {
            await dispatch(loginUser(demoUser));
        } catch (error) {
            setErrors(error.errors);
        }
    };

    return (
        <div className="login">
            <img className="login-bg" src={HomeBckgnd} alt="Home Background" />
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="login-header">
                        <h1>Welcome back!</h1>
                        <div className="login-subheader">
                            We're so excited to see you again!
                        </div>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-credential">
                            <label htmlFor="credential">EMAIL OR USERNAME</label>
                            <input className="login-input" type="text" value={credential} onChange={(e) => setUser({ ...user, credential: e.target.value })}/>
                        </div>
                        <div className="login-password">
                            <label htmlFor="password">PASSWORD</label>
                            <input className="login-input" type="password" value={password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                        </div>
                        <div className="login-submit">
                            <button className="login-button" type="submit" >
                                Log In
                            </button>
                        </div>
                    </form>
                    <div className="register-link">Need an account? <a href='/register' className="register-link-button">Register</a></div>
                </div>
                <div className="spacer"></div>
                <div className="login-demo">
                    <div className="login-demo-header">
                        <h1>Try Out Concord!</h1>
                        <p>Click on one of the users below to check out the app.</p>
                    </div>
                    <div className="login-demo-buttons">
                        <button className="demo-button" onClick={handleDemo} value={'1'}>Demo User 1</button>
                        <button className="demo-button" onClick={handleDemo} value={'2'}>Demo User 2</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;