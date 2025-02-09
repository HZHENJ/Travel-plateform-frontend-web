import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar () {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 检查用户是否登录
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // 处理登出逻辑
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false); // 更新状态
    navigate("/signin"); // 跳转到登录页
  };

  return(
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold">Singapore Travel</a>
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-blue-200 transition duration-300">Home</Link>
          <Link to="/flight" className="hover:text-blue-200 transition duration-300">Flight</Link>
          <Link to="/hotels" className="hover:text-blue-200 transition duration-300">Hotels</Link>
          <Link to="/attractions" className="hover:text-blue-200 transition duration-300">Atrractions</Link>
          <Link to="/schedule" className="hover:text-blue-200 transition duration-300">Schedule</Link>
        </div>

        {/* 根据 `isLoggedIn` 状态显示不同按钮 */}
        <div className="flex items-center space-x-3">
          <img
              src={isLoggedIn ? "/images/avatar.jpg" : "/images/avatar.jpg"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-white"
              onClick={() => {navigate("/profile")}}
          />
          {isLoggedIn ? (
            <Link onClick={handleLogout} className="text-white font-semibold hover:text-blue-200 transition duration-300">Logout</Link>
          ) : (
              <Link to="/signin" className="text-white font-semibold hover:text-blue-200 transition duration-300">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
  