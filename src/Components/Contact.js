import React, { useState } from 'react';
import './Contact.css';

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        const phoneNumber = "7207547829";  
        const encodedMessage = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappLink, '_blank');

        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div>
            <nav className="navbar"></nav>
            <div className="contact-container">
                <div className="contact-box">
                    <div className="box contact-info">
                        <h2>Contact Us</h2>
                        <p>If you have any questions, feedback, or inquiries, feel free to reach out to us.</p>
                        
                        <div className="info-item">
                            <div className="icon-box"><span className="icon">📍</span></div>
                            <div className="text">
                                <strong>Address</strong>
                                <p>Vignan's Foundation for Science, Technology and Research, Vadlamudi, Guntur-522213</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-box"><span className="icon">📞</span></div>
                            <div className="text">
                                <strong>Phone</strong>
                                <p>0863-2344700 / 701</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="icon-box"><span className="icon">✉️</span></div>
                            <div className="text">
                                <strong>Email</strong>
                                <p>info@vignan.ac.in</p>
                            </div>
                        </div>

                        <div className="social-media">
                            <p>Connect with us:</p>
                            <div className="social-icons">
                                <a href="https://www.facebook.com/VignanEcell/" target="_blank" rel="noopener noreferrer">Facebook</a>
                                <a href="https://www.instagram.com/vignan_ecell/p/DBxpym5zKUK/" target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a href="https://www.linkedin.com/school/vignan-ecell/?originalSubdomain=in" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </div>
                        </div>
                    </div>

                    <div className="box message-form">
                        <h2>Send Message</h2>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                id="name" 
                                placeholder="Enter Name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <textarea 
                                id="message" 
                                placeholder="Type your Message..." 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                required 
                            ></textarea>
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
