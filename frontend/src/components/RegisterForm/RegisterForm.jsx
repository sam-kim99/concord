import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import { createUser } from "../../store/sessionReducer";
import HomeBckgnd from '../../assets/bg.png'
import './RegisterForm.css'


const RegisterForm = props => {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.username);
    const [ errors, setErrors ] = useState({
        email: [],
        username: [],
        password: []
    })

    const [ user, setUser ] = useState({
        email: '',
        username: '',
        password: ''
    });

    const { email, username , password } = user;

    const handleSubmit = async (e) => { 
        e.preventDefault();

        if (!email || !username || !password) {
            setErrors({ 
                email: email ? [] : ['Email is required'],
                username: username ? [] : ['Username is required'],
                password: password ? [] : ['Password is required']
            });
            return;
        }

        try {
            await dispatch(createUser(user));
        } catch (error) {
            setErrors(error.errors); 
        }
    };

    return (
        <div className="signup">
            <img className="login-bg" src={HomeBckgnd} alt="Home Background" />
            <div className="signup-wrapper">
                <div className="signup-container">
                    <div className="signup-header">
                        <h1>Create an account</h1>
                    </div>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="signup-email">
                            <label htmlFor="email">EMAIL</label>
                            <input className="signup-input" type="text" value={email} onChange={(e) => setUser({ ...user, email: e.target.value })}/>
                        </div>
                        <div className="signup-username">
                            <label htmlFor="username">USERNAME</label>
                            <input className="signup-input" type="text" value={username} onChange={(e) => setUser({ ...user, username: e.target.value })}/>
                        </div>
                        <div className="signup-password">
                            <label htmlFor="password">PASSWORD</label>
                            <input className="signup-input" type="password" value={password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                        </div>
                        <div className="signup-submit">
                            <button className="signup-button" type="submit" >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <div className="login-link"><a href='/' className="login-link-button">Already have an account?</a></div>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm;