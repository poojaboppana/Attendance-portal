import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import About from './Components/About';
import Login from './Components/Login';
import Services from './Components/Services';
import Register from './Components/Register';
import Contact from './Components/Contact';
import Admin from './Components/Admin';
import Professor from './Components/Professor';
import Student from './Components/Student';
import ProfilePage from './Components/ProfilePage.js';
function AppContent() {
  const location = useLocation();
  
  // List of paths where navbar should be hidden
  const noNavbarPaths = ['/studentdashboard', '/admin', '/professor', '/login', '/register'];
  
  // Check if current path should hide navbar
  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/services' element={<Services />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/professor' element={<Professor />} />
        <Route path='/studentdashboard' element={<Student />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;