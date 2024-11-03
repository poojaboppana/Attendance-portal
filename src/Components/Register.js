import ecellogo from './ecellogo.png';
import ecel1 from './ecel1.png';
import './Register.css'
function Register(){
    return(
        <div className='register'>
              <div className='img'>
            <img src={ecel1} alt="ecel1" className='ecelimg'></img>
          </div>
        <div className='register-form'>
          <form action="/register" method="post">
          <img src={ecellogo} alt='ecellogo' className='logo'></img>
          <h2>Vignan ECell</h2>
          <input type='text' placeholder='Username'></input>
          <input type='password' placeholder='Password'></input>
          <input type='password' placeholder='Confirm Password'></input>
          <button type='submit'>Sign Up</button>
          </form>
          </div>
        
        </div>
    );
}
export default Register;