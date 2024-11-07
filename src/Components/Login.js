// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ecellogo from './ecellogo.png';
import ecel1 from './ecel1.png';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!role) {
            setMessage('Please select a role.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password, role });

            if (response.data.success) {
                setMessage('Login successful!');
                // Redirect based on the selected role
                switch (role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'professor':
                        navigate('/professor');
                        break;
                    case 'student':
                        navigate('/student');
                        break;
                    default:
                        setMessage('Invalid role selected.');
                }
            } else {
                setMessage(response.data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className='login'>
            <div className='login-form'>
                <form onSubmit={handleLogin}>
                    <img src={ecellogo} alt='ecellogo' className='logo' />
                    <h2>Vignan ECell</h2>
                    <input 
                        type='text' 
                        placeholder='Email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type='password' 
                        placeholder='Password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    
                    <select 
                        name="role" 
                        className="role-select" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        required 
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="professor">Professor</option>
                        <option value="student">Student</option>
                    </select>

                    <button type='submit'>Sign In</button>
                    {message && <p className="error-message">{message}</p>}
                    <p>Don't have an account?<a href="/register"> Register here</a></p>
                </form>
            </div>
            <div className='img'>
                <img src={ecel1} alt="ecel1" className='ecelimg' />
            </div>
        </div>
    );
}

export default Login;