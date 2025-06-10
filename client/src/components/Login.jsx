import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { user, login, loading } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login({username, password});      
      if(success){
        navigate('/dashboard');
      }
      else{
        setError('Login failed: Inavlid response from server');
      }
    } catch (error) {
      setError( error.response?.data?.message || 'Login failed. Please try again.');
    }
  }

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div className='register-container'>
      <div className='form-card'>
        <h4 className='form-title'>Login</h4>
        {error && <p className='error'>{error}</p>}
        <div className="form-group"> 
          <input type="text" placeholder='Username or E-mail' className='form-input' value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder='Password' className='form-input' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className='form-btn' onClick={handleSubmit}>Login</button>
          <p>
            New User? <Link to={'/register'}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;