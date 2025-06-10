import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [profileImage, setProfileImage] = useState(`/uploads/default.png`);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('contact', contact);
    if(profileImage){
      formData.append('profile_image', profileImage);
    }

    try {
      await axios.post('http://localhost:5000/api/v1/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  }

  return (
    <div className='register-container'>
      <div className='form-card'>
        <h4 className='form-title'>Register</h4>
        {error && <p className='error'>{error}</p>}
        <div className="form-group">
          <input type="text" placeholder='Username' className='form-input' value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="email" placeholder='E-mail' className='form-input' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="contact" placeholder='Contact (optional)' className='form-input' value={contact} onChange={(e) => setContact(e.target.value)} />
          <input type="password" placeholder='Password' className='form-input' value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="file" accept='image/*' className='form-input' onChange={(e) => setProfileImage(e.target.files[0])} />
          <button className='form-btn' onClick={handleSubmit}>Register</button>
          <p>
            Registered already? <Link to={'/login'}>Sign In</Link>
          </p>        
        </div>
      </div>
    </div>
  )
}

export default Register;