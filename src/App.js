import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/about' Component={About} />
        <Route path='/login' Component={Login} />
        <Route path='/register' Component={Register} />
        <Route path='/services' Component={Services} />
        <Route path='/contact' Component={Contact} />
        <Route path='/admin' Component={Admin} />
        <Route path='/professor' Component={Professor} />
        <Route path='/student' Component={Student} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
