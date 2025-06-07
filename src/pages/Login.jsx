import React from 'react';
import { useState } from 'react';
import { Bell, Mail, Lock } from 'lucide-react';
import sos from '../assets/sos_login.jpg';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const deviceId = 'iphone12';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    try {
      await login(email, password, deviceId);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // <div className="">
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 ml-20 p-5 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Bell className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-sm uppercase">
              Rescue Assistance System
            </span>
          </div>
        </div>

        <div className="max-w-max ml-10">
          <h1 className="text-2xl font-bold mb-5">Administrators in RAS</h1>

          <p className="mb-6 text-gray-700">
            They are the backbone of the system's operational management, <br />
            ensuring seamless coordination between <br />
            End Users, Rescue Teams, and the platform itself.
          </p>

          <p className="mb-4 text-gray-700">
            They are divided into three specialized sub-roles— <br />
            <span className="font-bold">
              Content Admin, Rescue Coordination Admin, and <br />
              System Admin
            </span>
            —each with distinct responsibilities that <br />
            collectively support the system's mission of saving lives <br />
            and enhancing community resilience.
          </p>

          <div className="mt-3 ml-8">
            <img
              src={sos}
              alt="SOS Emergency Illustration"
              className="w-lg ml-2"
            />
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-red-500 items-center justify-center">
        <div className="w-full max-w-md px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-white text-gray-800 py-3 px-4 rounded focus:outline-none"
                required
              />
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white text-gray-800 py-3 px-4 rounded focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-red-500 font-medium py-3 rounded hover:bg-red-100 transition-colors"
            >
              {isLoading ? 'Logging in...' : 'Submit'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
