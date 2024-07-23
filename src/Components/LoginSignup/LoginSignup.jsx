import React, { useState } from 'react';
import styles from './LoginSignup.module.css';
import axios from 'axios';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import logo from '../Assets/Logo.svg';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async () => {
        setError("");
        try {
            if (action === "Login") {
                const response = await axios.post('http://192.168.43.232:5000/api/users/login', { email, password });
                console.log(response.data);
                // Save token in local storage
                localStorage.setItem('token', response.data.token);
                // Navigate to AdminDashboard
                navigate('/AdminDashboard');

            } else {
                await axios.post('http://192.168.43.232:5000/api/users/register', { name, email, password });
                setAction("Login");
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleSwitchAction = () => {
        setAction(action === "Sign Up" ? "Login" : "Sign Up");
    };

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={logo} alt="logo" />
            </div>
            <div className={styles.header}>
                <div className={styles.text}>{action}</div>
                <div className={styles.underline}></div>
            </div>
            <div className={styles.inputs}>
                {action === "Login" ? null : (
                    <div className={styles.input}>
                        <img src={user_icon} alt="User Icon" />
                        <input 
                            type="text" 
                            placeholder='Username' 
                            aria-label="Username"
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                )}
                <div className={styles.input}>
                    <img src={email_icon} alt="Email Icon" />
                    <input 
                        type="email" 
                        placeholder='Email' 
                        aria-label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className={styles.input}>
                    <img src={password_icon} alt="Password Icon" />
                    <input 
                        type="password" 
                        placeholder='Password' 
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                {action === "Sign Up" ? null : (
                    <div className={styles.forgotPassword}>Lost password? <span>Click Here!</span></div>
                )}
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.submitContainer}>
                    <div 
                        className={styles.submit}
                        onClick={handleSubmit}
                    >
                        {action}
                    </div>
                    <div 
                        className={`${styles.submit} ${styles.gray}`}
                        onClick={handleSwitchAction}
                    >
                        {action === "Sign Up" ? "Login" : "Sign Up"}
                    </div>
                </div>
                <div className={styles.terms}>
                    <span>Terms of Use Privacy Policy</span>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
