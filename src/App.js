import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import  About from './Components/About'
import Login from './Components/Login'
import Services from './Components/Services'
import Register from './Components/Register'
import Contact from './Components/Contact'

function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path='/' Component={Home}></Route>
      <Route path='/about' Component={About}></Route>
      <Route path='/login' Component={Login}></Route>
      <Route path='/register' Component={Register}></Route>
      <Route path='/services' Component={Services}></Route>
      <Route path='/contact' Component={Contact}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
