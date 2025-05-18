import React, { useState } from 'react';
import axios from 'axios';
import ecellogo from './ecellogo.png';
import ecel1 from './ecel1.png';
import './Register.css';
import Navbar from './Navbar';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

const verticals = ['C&D', 'R&C', 'MR', 'Marketing', 'PR', 'CC', 'F&L'];

function Register() {
    const [name, setName] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [vertical, setVertical] = useState(verticals[0]);
    const [message, setMessage] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/auth/register', {
                name,
                regNumber,
                password,
                vertical
            });

            if (response.data.success) {
                setMessage('Registration successful!');
                setTimeout(() => navigate('/login'), 1000);
            } else {
                setMessage(response.data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className='register-page-container'>
            <Navbar 
                scrolled={false} 
                menuOpen={menuOpen} 
                setMenuOpen={setMenuOpen} 
            />
            <div className='register-image-container'>
                <img src={ecel1} alt="ecel1" className='register-side-image' />
            </div>
            <div className='register-form-container'>
                <form className='register-auth-form' onSubmit={handleRegister}>
                    <img src={ecellogo} alt='ecellogo' className='register-logo' />
                    <h2 className='register-title'>Vignan ECell</h2>

                    <input 
                        type='text' 
                        className='register-input'
                        placeholder='Full Name' 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                    <input 
                        type='text' 
                        className='register-input'
                        placeholder='Registration Number' 
                        value={regNumber} 
                        onChange={(e) => setRegNumber(e.target.value)} 
                        required 
                    />
                    <input 
                        type='password' 
                        className='register-input'
                        placeholder='Password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <input 
                        type='password' 
                        className='register-input'
                        placeholder='Confirm Password' 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                    <select
                        className='register-input'
                        value={vertical}
                        onChange={(e) => setVertical(e.target.value)}
                        required
                    >
                        {verticals.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                    <button type='submit' className='register-button'>Sign Up</button>
                    {message && <p className="register-error-message">{message}</p>}
                    <p className='register-login-link'>
                        Already have an account? 
                        <a href="/login" className='register-login-anchor'> Login here</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;