import axios from 'axios';
import { useEffect, useState } from 'react';

function Profile() {

  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    formData.append('profile_image', profilePicture);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/update-profile-picture', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUser(prevUser => ({
        ...prevUser,
        profile_picture: response.data.profile_picture
      }));
      setProfilePicture(null);
    } catch (error) {
      setError('Failed to upload profile picture');
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try{
      const response = await axios.get('http://localhost:5000/api/v1/auth/me', { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      setError('Failed to fetch user data');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if(!user && !error) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h4 className='profile-title'>Profile</h4>
        {error && <p className='error'>{error}</p>}
        {user && <div className="profile-info">
          <p>
          <strong>Username :</strong> {user.username}
        </p>
        <p>
          <strong>E-mail :</strong> {user.email}
        </p>
        <p>
          <strong>Contact :</strong> {user.contact}
        </p>
        {user.profile_picture && 
        <img className='profile-image' src={`http://localhost:5000${user.profile_picture}`} 
        alt='placeholder image'/>}
        
        <input type="file" accept='image/*' className='form-input' onChange={(e) => setProfilePicture(e.target.files[0])}/>
        {profilePicture && <button className='form-btn' onClick={handleImageUpload}>Upload profile picture</button>}
        </div>}
      </div>
    </div>
  )
}

export default Profile;