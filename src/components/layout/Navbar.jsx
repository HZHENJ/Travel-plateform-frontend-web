const Navbar = () => (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold">
          Singapore Travel
        </a>
        <div className="hidden md:flex space-x-4">
          <a href="#" className="hover:text-blue-200 transition duration-300">
            Home
          </a>
          <a href="#" className="hover:text-blue-200 transition duration-300">
            Flight
          </a>
          <a href="#" className="hover:text-blue-200 transition duration-300">
            Hotels
          </a>
          <a href="#" className="hover:text-blue-200 transition duration-300">
            Atrractions
          </a>
          <a href="#" className="hover:text-blue-200 transition duration-300">
            Schedule
          </a>
        </div>
        <a
          href="#"
          className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-100 transition duration-300"
        >
          Sign in/Sign up
        </a>
      </div>
    </nav>
  );
  
  export default Navbar;
  