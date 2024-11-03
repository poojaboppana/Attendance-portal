import ecellogo from './ecellogo.png';
import ecel1 from './ecel1.png';
import './Login.css'
function Login(){
    return(
        <div className='login'>
        <div className='login-form'>
          <form action="/login" method="post">
          <img src={ecellogo} alt='ecellogo' className='logo'></img>
          <h2>Vignan ECell</h2>
          <input type='text' placeholder='Username'></input>
          <input type='password' placeholder='Password'></input>
          <button type='submit'>Sign In</button>
          </form>
          </div>
          <div className='img'>
            <img src={ecel1} alt="ecel1" className='ecelimg'></img>
          </div>
        </div>
    );
}
export default Login;