// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import LoginPage from './User/Login'
// // import { Route, Router } from 'lucide-react'
// // import { Routes } from 'react-router-dom'
// import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
// import SignupPage from './User/Signup'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//     <Router>
//       <Routes>
//         <Route path='/register' element = {<SignupPage/>}/>
//       </Routes>
//     </Router>
      
//     </>
//   );
// }

// export default App

import { useState } from 'react'

import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import SignupPage from './User/Signup'
import Homepage from './User/homepage'


import AdminDashboard from './Admin/AdminDashboard'
import AdminMeals from './Admin/AdminMeals'
import AdminRevenue from './Admin/AdminRevenue'
import AdminWorkouts from './Admin/AdminWorkouts'
import AdminUsers from './Admin/AdminUsers'
import AdminProfile from './Admin/AdminProfile'
import LoginPage from './User/Login'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path='/register' element = {<SignupPage />} />
        
        <Route path = '/' element= {<Homepage />} /> 
        
        <Route path= '/admin/dashboard' element = {<AdminDashboard />} />
        <Route path= '/admin/meals' element = {<AdminMeals />} />
        <Route path= '/admin/revenue' element = {<AdminRevenue />} />
        <Route path= '/admin/workouts' element = {<AdminWorkouts />} />
        <Route path= '/admin/users' element = {<AdminUsers />} />
        <Route path= '/admin/profile' element = {<AdminProfile />} />
         <Route path='/login' element = {<LoginPage/>} /> 
       


      </Routes>
    </Router>
    
    </>
  );
}

export default App

