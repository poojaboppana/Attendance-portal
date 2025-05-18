import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import './Home.css';
import ecellogo from './ecellogo.png';
import Navbar from './Navbar';

const Home = () => {
  const [activeVertical, setActiveVertical] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedVertical, setSelectedVertical] = useState(null);
  const [showVerticalModal, setShowVerticalModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const verticals = [
    { id: 'pr', name: 'Public Relations', description: 'Building bridges between E-Cell and the world through strategic communication and networking.' },
    { id: 'r&c', name: 'Resource & Counselling', description: 'Providing data-driven insights and expert guidance to nurture entrepreneurial ventures.' },
    { id: 'c&d', name: 'Creative Designing', description: 'Transforming ideas into visually stunning realities with innovative design solutions.' },
    { id: 'mr', name: 'Media Relations', description: 'Crafting compelling narratives and managing our digital presence across platforms.' },
    { id: 'marketing', name: 'Marketing', description: 'Developing strategic campaigns to promote our initiatives and maximize impact.' },
    { id: 'f&l', name: 'Finance & Logistics', description: 'Ensuring operational excellence through meticulous financial planning and resource management.' },
    { id: 'cc', name: 'Corporate Communications', description: 'Fostering entrepreneurship culture within campus through workshops and events.' }
  ];

  return (
    <div className="home-page">
      <Navbar scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-line">VIGNAN</span>
              <span className="title-line-1">ENTREPRENEURSHIP CELL</span>
            </h1>
            <p className="hero-subtitle">"Stand out from the crowd"</p>
            <a href="#events" className="btn btn-primary">Explore Events</a>
          </div>
          <div className="hero-image">
            <div className="verticals-circle">
              <div className="center-logo">
                <img src={ecellogo} alt="Vignan E-Cell Logo" />
              </div>
              <div className="vertical-item" data-angle="0">
                <span>PR</span>
              </div>
              <div className="vertical-item" data-angle="51.4">
                <span>R&C</span>
              </div>
              <div className="vertical-item" data-angle="102.8">
                <span>C&D</span>
              </div>
              <div className="vertical-item" data-angle="154.2">
                <span>MR</span>
              </div>
              <div className="vertical-item" data-angle="205.7">
                <span>Marketing</span>
              </div>
              <div className="vertical-item" data-angle="257.1">
                <span>F&L</span>
              </div>
              <div className="vertical-item" data-angle="308.5">
                <span>CC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">About Vignan E-Cell</h2>
          <div className="about-content">
            <div className="about-image">
              <div className="image-wrapper">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="E-Cell team" />
              </div>
            </div>
            <div className="about-text">
              <p>
                Vignan Entrepreneurship Cell is a student-run organization dedicated to fostering the entrepreneurial spirit among students. We provide a platform for young minds to develop their ideas, gain practical knowledge, and connect with like-minded individuals.
              </p>
              <p>
                Our mission is to create an ecosystem that nurtures innovation, creativity, and problem-solving skills essential for tomorrow's leaders.
              </p>
              <div className="stats">
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Events</span>
                </div>
                <div className="stat">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Members</span>
                </div>
                <div className="stat">
                  <span className="stat-number">20+</span>
                  <span className="stat-label">Startups</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verticals Section */}
      <section id="verticals" className="verticals">
        <div className="container">
          <h2 className="section-title">Our Verticals</h2>
          <p className="section-subtitle">Seven specialized teams working together to foster entrepreneurship</p>
          <div className="vertical-cards">
            {verticals.map((vertical, index) => (
              <div
                key={vertical.id}
                className={`vertical-card ${activeVertical === vertical.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveVertical(vertical.id)}
                onMouseLeave={() => setActiveVertical(null)}
                onClick={() => {
                  setSelectedVertical(vertical);
                  setShowVerticalModal(true);
                }}
                style={{ '--delay': index * 0.1 + 's' }}
              >
                <div className="card-content">
                  <h3 className="vertical-name">{vertical.name}</h3>
                  <p className="vertical-description">{vertical.description}</p>
                </div>
                <div className="card-abbreviation">{vertical.id.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="events">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="event-cards">
            <div className="event-card">
              <div className="event-date">
                <span className="date-day">15</span>
                <span className="date-month">OCT</span>
              </div>
              <div className="event-details">
                <h3 className="event-title">Startup Conclave</h3>
                <p className="event-description">A gathering of successful entrepreneurs sharing their journey and insights.</p>
                <button className="btn btn-primary">Register Now</button>
              </div>
            </div>
            <div className="event-card">
              <div className="event-date">
                <span className="date-day">22</span>
                <span className="date-month">OCT</span>
              </div>
              <div className="event-details">
                <h3 className="event-title">Ideathon</h3>
                <p className="event-description">24-hour hackathon to develop innovative solutions for real-world problems.</p>
                <button className="btn btn-primary">Register Now</button>
              </div>
            </div>
            <div className="event-card">
              <div className="event-date">
                <span className="date-day">05</span>
                <span className="date-month">NOV</span>
              </div>
              <div className="event-details">
                <h3 className="event-title">Investor Pitch</h3>
                <p className="event-description">Opportunity to pitch your startup idea to potential investors.</p>
                <button className="btn btn-primary">Register Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Contact Us</h3>
              <p>If you have any questions, feedback, or inquiries, feel free to reach out to us.</p>
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div className="text">
                  <strong>Address</strong>
                  <p>Vignan's Foundation for Science, Technology and Research, Vadlamudi, Guntur-522213</p>
                </div>
              </div>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <div className="text">
                  <strong>Phone</strong>
                  <p>Indu Sree (TR) - 91 96762 52815</p>
                  <p>Akhil (VTR) - 91 63026 27565</p>
                  <p>Snigdha (VTR) - 91 75694 62381</p>
                </div>
              </div>
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div className="text">
                  <strong>Email</strong>
                  <p>info@vignan.ac.in</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <h3>Send Message via WhatsApp</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const name = e.target.name.value;
                const email = e.target.email.value;
                const message = e.target.message.value;
                if (!name || !email || !message) {
                  alert("Please fill in all fields.");
                  return;
                }
                const phoneNumber = "+918074832433";
                const encodedMessage = encodeURIComponent(
                  `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
                );
                const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                window.open(whatsappLink, '_blank');
                e.target.reset();
              }}>
                <div className="form-group">
                  <input type="text" name="name" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send via WhatsApp</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Vertical Modal */}
      {showVerticalModal && selectedVertical && (
        <div className="vertical-modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowVerticalModal(false)}>×</button>
            <h3>{selectedVertical.name}</h3>
            <div className="modal-body">
              {selectedVertical.id === 'pr' && (
                <>
                  <p><strong>Lead:</strong> Kiran - 85550 05475</p>
                  <p><strong>Secretaries:</strong> Pavan Sai - 83328 06666, Teja Venkat - 79951 71353</p>
                  <p>Publicizes events through various platforms and manages awareness campaigns to attract the desired audience.</p>
                </>
              )}
              {selectedVertical.id === 'r&c' && (
                <>
                  <p><strong>Lead:</strong> Darshini - 82478 80149</p>
                  <p><strong>Secretary:</strong> Manogna - 73965 52808, Pooja - 72075 47829</p>
                  <h4>Responsibilities:</h4>
                  <ul>
                    <li>Creation of registration and feedback forms for events</li>
                    <li>Maintaining event records (permission letters, budgets, media files)</li>
                    <li>Managing member records, performance tracking, and attendance</li>
                    <li>Facilitating smooth work coordination and dispute-free environment</li>
                  </ul>
                </>
              )}
              {selectedVertical.id === 'c&d' && (
                <>
                  <p><strong>Lead:</strong> Aman - 94417 98770</p>
                  <p><strong>Secretaries:</strong> Suchita - 74161 49878, Amarendra - 96185 62549</p>
                  <p>Responsible for designing event posters and brochures, as well as handling app and website development.</p>
                </>
              )}
              {selectedVertical.id === 'mr' && (
                <>
                  <p><strong>Lead:</strong> Likhitha - 93907 20020</p>
                  <p><strong>Secretaries:</strong> Pavan - 85229 27443, Sarayu - 93980 12465</p>
                  <p>Handles post and pre-event media coverage, reports, and presentations, coordinating with R&C and the Media Centre.</p>
                </>
              )}
              {selectedVertical.id === 'marketing' && (
                <>
                  <p><strong>Lead:</strong> Eswar - 95021 44036</p>
                  <p><strong>Secretary:</strong> Varshitha - 95739 79022, Karthikeya - 83094 80281</p>
                  <p>This vertical strategizes and targets various market sectors to manage fundraisers and start-up initiatives.</p>
                </>
              )}
              {selectedVertical.id === 'f&l' && (
                <>
                  <p><strong>Lead:</strong> Sai Kiran - 94406 72439</p>
                  <p><strong>Secretaries:</strong> Bala - 79812 16560, Eswar - 90599 49131</p>
                  <p>Oversees budget planning, expenditure tracking, and coordinates fundraising with external agencies.</p>
                </>
              )}
              {selectedVertical.id === 'cc' && (
                <>
                  <p><strong>Lead:</strong> Vinay - 78933 88565</p>
                  <p><strong>Secretaries:</strong> Veera - 93924 09326, Sanjana - 63022 05475</p>
                  <p>Manages corporate tie-ups, guest profiles, start-up mentoring, E-Cell partnerships, and internship collaborations.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="vignan">VIGNAN</span>
                <span className="ecell">E-CELL</span>
              </div>
              <div className="footer-social">
                <a href="https://www.facebook.com/VignanEcell/" target="_blank" rel="noopener noreferrer" className='social-a'>
                  <FaFacebookF className="social-icon" />
                </a>
                <a href="https://www.instagram.com/vignan_ecell/p/DBxpym5zKUK/" target="_blank" rel="noopener noreferrer" className='social-a'>
                  <FaInstagram className="social-icon" />
                </a>
                <a href="https://www.linkedin.com/school/vignan-ecell/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" className='social-a'>
                  <FaLinkedinIn className="social-icon" />
                </a>
              </div>
            </div>
            <div className="footer-links">
              <h3 className="footer-title">Quick Links</h3>
              <ul>
                <li><a href="#home" onClick={(e) => { e.preventDefault(); document.getElementById('home').scrollIntoView({ behavior: 'smooth' }); }}>Home</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }}>About</a></li>
                <li><a href="#verticals" onClick={(e) => { e.preventDefault(); document.getElementById('verticals').scrollIntoView({ behavior: 'smooth' }); }}>Verticals</a></li>
                <li><a href="#events" onClick={(e) => { e.preventDefault(); document.getElementById('events').scrollIntoView({ behavior: 'smooth' }); }}>Events</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); }}>Contact</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h3 className="footer-title">Contact Info</h3>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <p>Vignan's Foundation for Science, Technology & Research, Guntur</p>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <p>+91 9876543210</p>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <p>info@vignan.ac.in</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Vignan Entrepreneurship Cell. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;