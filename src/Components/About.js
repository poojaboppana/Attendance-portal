import React, { useState } from "react";
import "./About.css";

function About() {
    const [activeTab, setActiveTab] = useState("about");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="about-container">
            <h1>About Vignan E-Cell</h1>
            <p>The Vignan E-Cell (Entrepreneurship Cell) is dedicated to promoting innovation and entrepreneurship among students at Vignan University. Our mission is to nurture and empower young entrepreneurs by providing them with the resources, mentorship, and support needed to turn their ideas into reality.</p>

            <h2>Join Us</h2>
            <p>If you're passionate about entrepreneurship and want to be part of a community that supports and drives innovation, join the Vignan E-Cell. For more information, reach out to us at <a href="mailto:ecell@vignanuniversity.com">ecell@vignanuniversity.com</a>.</p>

            <div className="tabs">
                <button onClick={() => handleTabClick("about")} className={activeTab === "about" ? "active" : ""}>About</button>
                <button onClick={() => handleTabClick("teamRep")} className={activeTab === "teamRep" ? "active" : ""}>Team Representative</button>
                <button onClick={() => handleTabClick("resourceCounseling")} className={activeTab === "resourceCounseling" ? "active" : ""}>Resource and Counselling</button>
                <button onClick={() => handleTabClick("marketing")} className={activeTab === "marketing" ? "active" : ""}>Marketing</button>
                <button onClick={() => handleTabClick("mediaRelations")} className={activeTab === "mediaRelations" ? "active" : ""}>Media Relations</button>
                <button onClick={() => handleTabClick("financeLogistics")} className={activeTab === "financeLogistics" ? "active" : ""}>Finance and Logistics</button>
                <button onClick={() => handleTabClick("corporateCommunications")} className={activeTab === "corporateCommunications" ? "active" : ""}>Corporate Communications</button>
                <button onClick={() => handleTabClick("creativeDesigning")} className={activeTab === "creativeDesigning" ? "active" : ""}>Creative Designing & Technical</button>
                <button onClick={() => handleTabClick("publicRelations")} className={activeTab === "publicRelations" ? "active" : ""}>Public Relations</button>
                <button onClick={() => handleTabClick("specialCoordinators")} className={activeTab === "specialCoordinators" ? "active" : ""}>Special Coordinators</button>
            </div>

            <div className="tab-content">
                {activeTab === "about" && (
                    <div>
                        <h2>About Vignan E-Cell</h2>
                        <p>Join us to foster a culture of entrepreneurship and innovation. Our team provides resources, mentorship, and more to help students turn their ideas into impactful ventures.</p>
                        <h3>Verticals Overview:</h3>
                        <ul>

                            <li>Marketing</li>
                            <li>Public Relations</li>
                            <li>Media Relations</li>
                            <li>Special Coordinators</li>
                            <li>Finance and Logistics</li>
                            <li>Resource and Counselling</li>
                            <li>Corporate Communications</li>
                            <li>Creative Designing & Technical</li>
                        </ul>
                    </div>
                )}
                {activeTab === "teamRep" && (
                    <div>
                        <h2>Team Representative</h2>
                        <p><strong>Indu Sree</strong> - 96762 52815</p>
                        <h3>Vice Team Representatives</h3>
                        <p>Akhil - 63026 27565</p>
                        <p>Snigdha - 75694 62381</p>
                    </div>
                )}
                {activeTab === "resourceCounseling" && (
                    <div>
                        <h2>Resource and Counselling</h2>
                        <p><strong>Lead:</strong> Darshini - 82478 80149</p>
                        <p><strong>Secretary:</strong> Manogna - 73965 52808, Pooja - 72075 47829</p>
                        <h3>Responsibilities:</h3>
                        <ul>
                            <li>Creation of registration and feedback forms for events</li>
                            <li>Maintaining event records (permission letters, budgets, media files)</li>
                            <li>Managing member records, performance tracking, and attendance</li>
                            <li>Facilitating smooth work coordination and dispute-free environment</li>
                        </ul>
                    </div>
                )}
                {activeTab === "marketing" && (
                    <div>
                        <h2>Marketing</h2>
                        <p><strong>Lead:</strong> Eswar - 95021 44036</p>
                        <p><strong>Secretary:</strong> Varshitha - 95739 79022, Karthikeya - 83094 80281</p>
                        <p>This vertical strategizes and targets various market sectors to manage fundraisers and start-up initiatives.</p>
                    </div>
                )}
                {activeTab === "mediaRelations" && (
                    <div>
                        <h2>Media Relations</h2>
                        <p><strong>Lead:</strong> Likhitha - 93907 20020</p>
                        <p><strong>Secretaries:</strong> Pavan - 85229 27443, Sarayu - 93980 12465</p>
                        <p>Handles post and pre-event media coverage, reports, and presentations, coordinating with R&C and the Media Centre.</p>
                    </div>
                )}
                {activeTab === "financeLogistics" && (
                    <div>
                        <h2>Finance and Logistics</h2>
                        <p><strong>Lead:</strong> Sai Kiran - 94406 72439</p>
                        <p><strong>Secretaries:</strong> Bala - 79812 16560, Eswar - 90599 49131</p>
                        <p>Oversees budget planning, expenditure tracking, and coordinates fundraising with external agencies.</p>
                    </div>
                )}
                {activeTab === "corporateCommunications" && (
                    <div>
                        <h2>Corporate Communications</h2>
                        <p><strong>Lead:</strong> Vinay - 78933 88565</p>
                        <p><strong>Secretaries:</strong> Veera - 93924 09326, Sanjana - 63022 05475</p>
                        <p>Manages corporate tie-ups, guest profiles, start-up mentoring, E-Cell partnerships, and internship collaborations.</p>
                    </div>
                )}
                {activeTab === "creativeDesigning" && (
                    <div>
                        <h2>Creative Designing & Technical</h2>
                        <p><strong>Lead:</strong> Aman - 94417 98770</p>
                        <p><strong>Secretaries:</strong> Suchita - 74161 49878, Amarendra - 96185 62549</p>
                        <p>Responsible for designing event posters and brochures, as well as handling app and website development.</p>
                    </div>
                )}
                {activeTab === "publicRelations" && (
                    <div>
                        <h2>Public Relations</h2>
                        <p><strong>Lead:</strong> Kiran - 85550 05475</p>
                        <p><strong>Secretaries:</strong> Pavan Sai - 83328 06666, Teja Venkat - 79951 71353</p>
                        <p>Publicizes events through various platforms and manages awareness campaigns to attract the desired audience.</p>
                    </div>
                )}
                {activeTab === "specialCoordinators" && (
                    <div>
                        <h2>Special Coordinators</h2>
                        <p><strong>Start-Up Coordinator:</strong> Kumar - 95507 63666</p>
                        <p><strong>IPR Coordinator:</strong> Shiva Sai - 81437 14028</p>
                        <p><strong>Internship Coordinator:</strong> Bindu - 93464 41248, Triveni - 79956 27385</p>
                        <p><strong>Social Media Coordinator:</strong> Asmin - 93471 28077</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default About;