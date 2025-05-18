import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ecellogo from './ecellogo.png';
import ecel1 from './ecel1.png';
import './Login.css';
import Navbar from './Navbar';

function Login() {
    const [regNumber, setRegNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!role) {
            setMessage('Please select a role.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/auth/login', {
                regNumber,
                password,
                role
            });

            if (response.data.success) {
                if (role === 'student') {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('role', response.data.role);
                    localStorage.setItem('regNumber', regNumber);
                    localStorage.setItem('studentDetails', JSON.stringify(response.data.student));
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    localStorage.removeItem('studentDetails');
                    localStorage.removeItem('regNumber');
                }

                setMessage('Login successful!');

                if (role === 'admin') navigate('/admin');
                else if (role === 'professor') navigate('/professor');
                else if (role === 'student') navigate('/studentdashboard');
                else setMessage('Invalid role returned from server.');
            } else {
                setMessage('Invalid credentials or role.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setMessage(error.response?.data?.message || 'Error during login. Please try again.');
        }
    };

    return (
        <div className='login-page-container'>
            <Navbar 
                scrolled={false} 
                menuOpen={menuOpen} 
                setMenuOpen={setMenuOpen} 
            />
            <div className='login-form-container'>
                <form className='login-auth-form' onSubmit={handleLogin}>
                    <img src={ecellogo} alt='ecellogo' className='login-logo' />
                    <h2 className='login-title'>Vignan ECell</h2>

                    <input 
                        type='text' 
                        className='login-input'
                        placeholder='Registration Number' 
                        value={regNumber} 
                        onChange={(e) => setRegNumber(e.target.value)} 
                        required 
                    />

                    <input 
                        type='password' 
                        className='login-input'
                        placeholder='Password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />

                    <select 
                        className='login-select'
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        required
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="professor">Professor</option>
                        <option value="student">Student</option>
                    </select>

                    <button type='submit' className='login-button'>Sign In</button>
                    {message && <p className="login-error-message">{message}</p>}
                </form>
                <p className='login-register-link'>
                    Don't have an account? <a href='/register' className='login-register-anchor'>Register</a>
                </p>
            </div>
            <div className='login-image-container'>
                <img src={ecel1} alt="ecel1" className='login-side-image' />
            </div>
        </div>
    );
}

export default Login;
