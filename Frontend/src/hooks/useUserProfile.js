import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export const useUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          toast.error('Please login first');
          navigate('/');
          return;
        }

        const response = await fetch('http://localhost:5001/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            dispatch(logout());
            toast.error('Session expired. Please login again');
            navigate('/');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUserData(data);
        console.log("User data received:", data);
      } catch (error) {
        toast.error(error.message);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, token, dispatch]);

  return { userData, loading, setUserData };
}; 