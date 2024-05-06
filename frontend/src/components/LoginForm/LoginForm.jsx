import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/sessionReducer";
import { useNavigate, Link } from "react-router-dom";
import HomeBckgnd from '../../assets/bg.png'
import './LoginForm.css'


const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const sessionUser = useSelector(state => state.session?.username);
    
    useEffect(() => {
        if (sessionUser) navigate('/channels/@me'); 
    }, [sessionUser, navigate])

    const [ user, setUser ] = useState({
        credential: '',
        password: ''
    });

    const [ errors, setErrors ] = useState({
        errors: ''
    });

    const { credential, password } = user;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(user))
            .catch(async res => {
                let data = await res.json();
                if (data.errors) {
                    setErrors(data)
                }
            })
    }

    const handleDemo = async (e) => {
        e.preventDefault();
        let demoUser;
        if (e.target.value === '1') {
            demoUser = {
                credential: 'SuperCoolGuy331',
                password: 'password!!!'
            };
        } else {
            demoUser = {
                credential: 'ketchup@test.com',
                password: 'must@rdreallysucks'
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
                            {`We're so excited to see you again!`}
                        </div>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-credential">
                            <label className={errors.errors ? "error" : "login-cred"}>EMAIL OR USERNAME{errors.errors ? (
                                <span className="err-msg"> - {errors.errors}</span>) : <span className="required">*</span> }
                            </label>
                            <input className="login-input" type="text" value={credential} onChange={(e) => setUser({ ...user, credential: e.target.value })}/>
                        </div>
                        <div className="login-password">
                            <label className={errors.errors ? "error" : "login-pw"}>PASSWORD{errors.errors ? (
                                    <span className="err-msg"> - {errors.errors}</span>) : <span className="required">*</span> }
                            </label>
                            <input className="login-input" type="password" value={password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                        </div>
                        <div className="login-submit">
                            <button className="login-button" type="submit" >
                                Log In
                            </button>
                        </div>
                    </form>
                    <div className="register-link">
                         Need an account? <Link to="/signup" className="register-link-button">Register</Link>
                    </div>
                </div>
                <div className="spacer"></div>
                <div className="login-demo">
                    <div className="login-demo-header">
                        <h1>Try Out Concord!</h1>
                        <p>Click on one of the users below to check out the app.</p>
                    </div>
                    <div className="login-demo-buttons">
                        <button className="demo-button" onClick={handleDemo} value={'1'}>SuperCoolGuy331</button>
                        <button className="demo-button" onClick={handleDemo} value={'2'}>ReallyAwesomeSauce369</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;