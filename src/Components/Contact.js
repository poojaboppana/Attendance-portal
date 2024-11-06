import React, { useState } from 'react';
import './Contact.css';

function Contact() {
    // State to hold form input values
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if all fields are filled
        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        const phoneNumber = "7207547829";  // Replace with your phone number
        const encodedMessage = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Open WhatsApp link in a new tab
        window.open(whatsappLink, '_blank');

        // Clear form after submission
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar"></nav>

            {/* Contact Page Content */}
            <div className="contact-container">
                {/* Create a small box with two sections */}
                <div className="contact-box">
                    {/* Contact Information Section */}
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

                        {/* Social Media Section */}
                        <div className="social-media">
                            <p>Connect with us:</p>
                            <div className="social-icons">
                                <a href="https://www.facebook.com/VignanEcell/" target="_blank" rel="noopener noreferrer">Facebook</a>
                                <a href="https://www.instagram.com/vignan_ecell/p/DBxpym5zKUK/" target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a href="https://www.linkedin.com/school/vignan-ecell/?originalSubdomain=in" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </div>
                        </div>
                    </div>

                    {/* Message Form Section */}
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