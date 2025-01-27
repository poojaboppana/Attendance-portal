import './Navbar.css'
import ecellogo from './ecellogo.png';
import {Link} from 'react-router-dom'
function Navbar(){  
    return(
        <div className='navbar'>
            <ul>
            <li> <img src={ecellogo} alt='ecell-logo' className='logo'></img></li>
           <li> <Link to='/'>Home</Link></li>
           <li> <Link to='/about'>About </Link></li>
           <li> <Link to='/services'>Services</Link></li>
           <li> <Link to='/contact'>Contact </Link></li>
           <li> <Link to='/login'>Login</Link></li>
           <li> <Link to='/register'>Register</Link></li>
            </ul>
        </div>
    );
}
export default Navbar;