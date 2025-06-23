import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Login from "../Pages/Login/Login"
import SignupWithFooter from '../Pages/Signup/Signup'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignupWithFooter />,
  },
]);

/**
 * Main application component that handles routing
 * @returns {JSX.Element} The main app with routing configuration
 */
const App = () => {
  return (
    <div data-theme="light">
      <RouterProvider router={router} />
    </div>
  )
}

export default App