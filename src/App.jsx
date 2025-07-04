// //import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   //return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// import React from 'react';
// import Profile from './components/Profile';
// import NotificationSettings from "./components/NotificationSettings";
// import GeneralSettings from "./components/GeneralSettings";

// const App = () => {
//   return (
//     <div className="bg-gray-100 min-h-screen flex justify-center items-center">
//       <Profile />
//     </div>
    

//   );
// };



// export default App;


// import React from 'react';
// import Profile from './components/Profile';
// import NotificationSettings from "./components/NotificationSettings";
// import MealDashboard from "./components/MealDashboard";

// const App = () => {
//   return (
//     <div className="bg-gray-100 min-h-screen flex justify-center items-center">
//       <Profile />
//     </div>
    

//   );
// };



// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Profile from "./components/Profile";
import NotificationSettings from "./components/NotificationSettings";
import GeneralSettings from "./components/GeneralSettings";
import MealDashboard from "./components/MealDashboard";
import CalorieTracker from "./components/CalorieTracker"; // ✅ new import

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md p-4 flex justify-center gap-10 text-lg font-medium">
          <Link to="/" className="text-blue-600 hover:underline">Profile</Link>
          <Link to="/notifications" className="text-blue-600 hover:underline">Notifications</Link>
          <Link to="/settings" className="text-blue-600 hover:underline">General Settings</Link>
          <Link to="/meals" className="text-blue-600 hover:underline">Meal Plan</Link>
          <Link to="/calories" className="text-blue-600 hover:underline">Calorie Tracker</Link> {/* ✅ new link */}
        </nav>

        {/* Main Content */}
        <div className="flex justify-center items-center p-10">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/notifications" element={<NotificationSettings />} />
            <Route path="/settings" element={<GeneralSettings />} />
            <Route path="/meals" element={<MealDashboard />} />
            <Route path="/calories" element={<CalorieTracker />} /> {/* ✅ new route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
