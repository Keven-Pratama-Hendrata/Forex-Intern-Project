import React, { useState } from "react";
import { useNavigate, Link } from "react-router";

import AuthBackground from "../../components/Background/AuthBackground.jsx";
import { Button, LoadingSpinner } from "../../components/common";
import {
  handleChange,
  handleSubmit,
  FormField
} from "./loginUtils.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  return (
    <AuthBackground circlePosition="login">
      <form
        onSubmit={handleSubmit(form, setLoading, navigate)}
        className="rounded-2xl bg-white/60 p-8 shadow-xl backdrop-blur-md ring-1 ring-white/40"
      >
        <h2 className="mb-1 text-center text-2xl font-extrabold text-gray-800">
          Sign in to Trade FX
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Ready to conquer the markets?
        </p>

        <FormField
          label="Username"
          type="text"
          name="username"
          placeholder="John Doe"
          value={form.username}
          onChange={handleChange(form, setForm)}
          autoComplete="username"
          required
        />

        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange(form, setForm)}
          autoComplete="current-password"
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner variant="inline" /> : "Log in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-700">
        New here?{" "}
        <Link to="/signup" className="font-medium text-sky-950 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthBackground>
  );
};

export default Login;