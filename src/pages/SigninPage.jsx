import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/common/MessageBox'
import { login } from '../api/user'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { addToast } = useToast();
  
  const navigate = useNavigate();

  // 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation input
    if (form.email.trim() === '' || form.password.trim() === '') {
      addToast("Username or Password can not be empty!", "error", 3000)
      return;
    }
    try {
      const response = await login({
        email: form.email,
        password: form.password
      })
      // console.log(response)
      if (response.status === 200) {
        const { token, userId, name, role } = response.data;
        
        // 存储 Token 和用户信息
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userRole", role);

        addToast('Successfully Login!', 'success', 3000);
        navigate('/');
      }
    } catch (error) {
      addToast("Login Failure", "error", 3000)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* left part */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-start p-16 bg-white">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-blue-600">Explore & Travel</h2>
          <p className="text-gray-500 mt-2">Your gateway to amazing experiences worldwide.</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center">
            <span className="mr-4 text-blue-500">🌍</span>
            <div>
              <h3 className="font-bold">Discover the World</h3>
              <p className="text-gray-500">Explore new destinations, from breathtaking landscapes to hidden gems.</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-blue-500">✈️</span>
            <div>
              <h3 className="font-bold">Seamless Booking</h3>
              <p className="text-gray-500">Book flights, hotels, and attractions effortlessly with our user-friendly platform.</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-blue-500">🏝️</span>
            <div>
              <h3 className="font-bold">Exclusive Experiences</h3>
              <p className="text-gray-500">Gain access to exclusive travel deals, local insights, and unique activities.</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-blue-500">📍</span>
            <div>
              <h3 className="font-bold">Personalized Recommendations</h3>
              <p className="text-gray-500">Get travel suggestions tailored to your preferences and past trips.</p>
            </div>
          </div>
        </div>
      </div>

      {/* right part sign in form */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-12 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Sign in with Google
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Sign in with Facebook
                </a>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {"Don't have an account? "}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
