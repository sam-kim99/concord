import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../store/sessionReducer";
import { useNavigate, Link } from "react-router-dom";
import HomeBckgnd from '../../assets/bg.png'
import './RegisterForm.css'


const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sessionUser = useSelector(state => state.session?.username);

    useEffect(() => {
        if (sessionUser) navigate('/channels/@me'); 
    }, [sessionUser, navigate])

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

    const handleSubmit =  (e) => { 
        e.preventDefault();
        dispatch(createUser(user))
            .catch(async res => {
                const data = await res.json()
                if (data) {
                    setErrors({ ...data })
                }
            })
    };

    return (
        <div className="signup">
            <img className="login-bg" src={HomeBckgnd} alt="Login Background" />
            <div className="signup-wrapper">
                <div className="signup-container">
                    <div className="signup-header">
                        <h1>Create an account</h1>
                    </div>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="signup-email">
                            <label className={errors.email && errors.email.length > 0 ? "error" : "reg-email"} htmlFor="email">EMAIL{errors.email && errors.email.length > 0 ? <span className="err-msg"> - {errors.email[0]}</span> : <span className="required">*</span> }</label>
                            <input className="signup-input" type="text" value={email} onChange={(e) => setUser({ ...user, email: e.target.value })}/>
                        </div>
                        <div className="signup-username">
                            <label className={errors.username && errors.username.length > 0 ? "error" : "reg-username"} htmlFor="username">USERNAME{errors.username && errors.username.length > 0 ? <span className="err-msg"> - {errors.username[0]}</span> : <span className="required">*</span> }</label>
                            <input className="signup-input" type="text" value={username} onChange={(e) => setUser({ ...user, username: e.target.value })}/>
                        </div>
                        <div className="signup-password">
                            <label className={errors.password && errors.password.length > 0 ? "error" : "reg-password"} htmlFor="password">PASSWORD{errors.password && errors.password.length > 0 ? <span className="err-msg"> - {errors.password[0]}</span> : <span className="required">*</span> }</label>
                            <input className="signup-input" type="password" value={password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                        </div>
                        <div className="signup-submit">
                            <button className="signup-button" type="submit" >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <div className="login-link">
                        <Link to="/login" className="login-link-button">Already have an account?</Link> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm;