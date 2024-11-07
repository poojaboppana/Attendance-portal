// register.js
import React, { useState } from 'react';
import axios from 'axios';
import ecellogo from './ecellogo.png';
import ecel1 from './ecel1.png';
import './Register.css';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
 
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/auth/register', { email, password });
            
            if (response.data.success) {
                setMessage('Registration successful!');
                setTimeout(() => navigate('/login'), 1000); // Redirect to login page after 1 second
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className='register'>
            <div className='img'>
                <img src={ecel1} alt="ecel1" className='ecelimg' />
            </div>
            <div className='register-form'>
                <form onSubmit={handleRegister}>
                    <img src={ecellogo} alt='ecellogo' className='logo' />
                    <h2>Vignan ECell</h2>
                    <input 
                        type='email' 
                        placeholder='Email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        type='password' 
                        placeholder='Password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <input 
                        type='password' 
                        placeholder='Confirm Password' 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                    <button type='submit'>Sign Up</button>
                    {message && <p className="error-message">{message}</p>}
                    <p>Already have an account?<a href="/login"> Login here</a></p>
                </form>
            </div>
        </div>
    );
}

export default Register;