import toast from "react-hot-toast";
import {
  LoadingSpinner,
  FormField,
  Button,
  handleFormChange,
  validateRequiredFields,
  setUserData
} from "../../components/common";

export const validateForm = (form) => {
  const validation = validateRequiredFields(
    form,
    ['username', 'password'],
    { username: 'Username is required', password: 'Password is required' }
  );

  if (!validation.isValid) {
    toast.error(validation.message);
    return false;
  }
  return true;
};

export const handleLogin = async (form, setLoading, navigate) => {
  try {
    setLoading(true);
    const response = await fetch("http://localhost:5001/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    setUserData(data.token, {
      id: data.userId,
      username: data.userName,
      balances: data.balances
    });

    toast.success("Welcome back 👋");
    navigate('/dashboard');
  } catch (error) {
    toast.error(error.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

export const handleSubmit = (form, setLoading, navigate) => async (e) => {
  e.preventDefault();
  if (!validateForm(form)) return;
  await handleLogin(form, setLoading, navigate);
};

export { LoadingSpinner, FormField, Button };
export const handleChange = handleFormChange; 