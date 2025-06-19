// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../store/slices/authSlice';
// import toast from 'react-hot-toast';

// function handleProfileError(error, navigate) {
//   toast.error(error.message);
//   navigate('/');
// }

// function handleNoToken(navigate) {
//   toast.error('Please login first');
//   navigate('/');
// }

// function handleUnauthorized(dispatch, navigate) {
//   dispatch(logout());
//   toast.error('Session expired. Please login again');
//   navigate('/');
// }

// function handleProfileSuccess(response, setUserData) {
//   response.json().then(data => {
//     setUserData(data);
//     console.log('User data received:', data);
//   });
// }

// async function fetchProfileResponse(token) {
//   return fetch('http://localhost:5001/api/users/profile', {
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
// }

// async function fetchUserProfileTry({ token, dispatch, navigate, setUserData }) {
//   if (!token) {
//     handleNoToken(navigate);
//     return;
//   }
//   const response = await fetchProfileResponse(token);
//   if (!response.ok) {
//     if (response.status === 401) {
//       handleUnauthorized(dispatch, navigate);
//       return;
//     }
//     throw new Error('Failed to fetch profile');
//   }
//   handleProfileSuccess(response, setUserData);
// }

// async function fetchUserProfile({ token, dispatch, navigate, setUserData, setLoading }) {
//   try {
//     await fetchUserProfileTry({ token, dispatch, navigate, setUserData });
//   } catch (error) {
//     handleProfileError(error, navigate);
//   } finally {
//     setLoading(false);
//   }
// }

// function useUserProfileEffect({ token, dispatch, navigate, setUserData, setLoading }) {
//   useEffect(() => {
//     fetchUserProfile({ token, dispatch, navigate, setUserData, setLoading });
//   }, [navigate, token, dispatch, setUserData, setLoading]);
// }

// /**
//  * Fetches and manages the authenticated user's profile, loading state, and exposes a setter.
//  *
//  * @returns {{ userData: object|null, loading: boolean, setUserData: function }}
//  *   userData: The fetched user profile or null if not loaded.
//  *   loading: True while fetching profile data.
//  *   setUserData: Setter to manually update user data.
//  */
// export const useUserProfile = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const token = useSelector(state => state.auth.token);
//   useUserProfileEffect({ token, dispatch, navigate, setUserData, setLoading });
//   return { userData, loading, setUserData };
// }; 