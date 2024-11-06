import React, { useState } from "react";
import "./Services.css";

function Services() {
    const [activeTab, setActiveTab] = useState("mentorship");

    const handleTabHover = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="services-container">
            <h1>Services Offered by Vignan E-Cell</h1>
            <p>The Vignan E-Cell provides various services to support and empower aspiring entrepreneurs at Vignan University. Our services are designed to enhance skills, provide guidance, and create networking opportunities.</p>

            <div className="tabs">
                <button onMouseEnter={() => handleTabHover("mentorship")} className={activeTab === "mentorship" ? "active" : ""}>Mentorship</button>
                <button onMouseEnter={() => handleTabHover("workshops")} className={activeTab === "workshops" ? "active" : ""}>Workshops</button>
                <button onMouseEnter={() => handleTabHover("networking")} className={activeTab === "networking" ? "active" : ""}>Networking Events</button>
                <button onMouseEnter={() => handleTabHover("funding")} className={activeTab === "funding" ? "active" : ""}>Funding Opportunities</button>
                <button onMouseEnter={() => handleTabHover("resources")} className={activeTab === "resources" ? "active" : ""}>Resources and Materials</button>
                <button onMouseEnter={() => handleTabHover("incubation")} className={activeTab === "incubation" ? "active" : ""}>Incubation Support</button>
            </div>

            <div className="tab-content">
                {activeTab === "mentorship" && (
                    <div className="content">
                        <h2>Mentorship</h2>
                        <p>We offer one-on-one mentorship sessions with experienced entrepreneurs and industry experts who can guide you through the challenges of starting and running a business.</p>
                    </div>
                )}
                {activeTab === "workshops" && (
                    <div className="content">
                        <h2>Workshops</h2>
                        <p>Participate in workshops that cover a range of topics from business planning to digital marketing, designed to enhance your entrepreneurial skills.</p>
                    </div>
                )}
                {activeTab === "networking" && (
                    <div className="content">
                        <h2>Networking Events</h2>
                        <p>Join our networking events to connect with fellow entrepreneurs, industry leaders, and potential investors. Build valuable relationships that can help your venture.</p>
                    </div>
                )}
                {activeTab === "funding" && (
                    <div className="content">
                        <h2>Funding Opportunities</h2>
                        <p>Access information about funding opportunities, grants, and competitions that can provide financial support for your start-up.</p>
                    </div>
                )}
                {activeTab === "resources" && (
                    <div className="content">
                        <h2>Resources and Materials</h2>
                        <p>We provide access to a wealth of resources, including guides, templates, and tools that can assist you in your entrepreneurial journey.</p>
                    </div>
                )}
                {activeTab === "incubation" && (
                    <div className="content">
                        <h2>Incubation Support</h2>
                        <p>Our incubation program offers support to start-ups in their early stages, providing guidance on business development and operational challenges.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Services;