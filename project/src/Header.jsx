import React from "react";

const Header = () => {
  return (
    <header
    
     className="w-full h-screen bg-cover bg-center text-white relative flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(10,20,40,0.7), rgba(10,20,40,0.85)), url('https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
      }}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 w-full max-w-[1440px] mx-auto">
        <div className="text-2xl md:text-4xl font-bold tracking-wide">FIT ME</div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium">
          Log In
        </button>
      </nav>
    </header>
  );
};

export default Header;
