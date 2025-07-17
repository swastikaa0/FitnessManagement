import { useState } from 'react'
import LoginPage from './user/login'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import SignupPage from './user/Signup'
import Homepage from './user/Homepage'
import UserDashboard from './user/Dashboard'
import Challenges from './user/Payments'
import MealsPlans from './user/Mealsplans'
import MyMealPlans from './user/Mymealplans'
import MyWorkouts from './user/Myworkouts'
import ProSuggestions from './user/suggestions'
import Workouts from './user/Workouts'
import Profile from './user/profile'
import Analytics from './user/Analytics'
import UpdateProfile from './user/Updateprofile'
import AdminDashboard from './admin/AdminDashboard'
import AdminMeals from './admin/AdminMeals'
import AdminRevenue from './admin/AdminRevenue'
import AdminWorkouts from './admin/AdminWorkouts'
import AdminUsers from './admin/AdminUsers'
import AdminProfile from './admin/AdminProfile'
import AdminSubscriptions from './admin/AdminSubscriptions'
import AdminLogin from './admin/AdminLogin'
import PlansModal from './user/plansmodel'
import NotificationsPage from './components/notifications'
import UserSubscription from './user/Payments'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/register' element={
            <ProtectedRoute requireAuth={false}>
              <SignupPage />
            </ProtectedRoute>
          } />
          <Route path='/login' element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } />
          <Route path='/login/admin' element={
            <ProtectedRoute requireAuth={false}>
              <AdminLogin />
            </ProtectedRoute>
          } />
          <Route path='/' element={
            <ProtectedRoute requireAuth={false}>
              <Homepage />
            </ProtectedRoute>
          } />
          
          <Route path='/dashboard' element={            <ProtectedRoute requirePremium={true}>              <UserDashboard />            </ProtectedRoute>          } />
          <Route path='/payments' element={
            <ProtectedRoute>
              <UserSubscription />
            </ProtectedRoute>
          } />
          <Route path='/payments/:planId' element={
            <ProtectedRoute>
              <UserSubscription />
            </ProtectedRoute>
          } />
          <Route path='/meals' element={
            <ProtectedRoute requirePremium={true}>
              <MealsPlans />
            </ProtectedRoute>
          } />
          <Route path='/my-meal-plans' element={
            <ProtectedRoute requirePremium={true}>
              <MyMealPlans />
            </ProtectedRoute>
          } />
          <Route path='/suggestions' element={
            <ProtectedRoute requirePremium={true}>
              <ProSuggestions />
            </ProtectedRoute>
          } />
          <Route path='/workouts' element={
            <ProtectedRoute requirePremium={true}>
              <Workouts />
            </ProtectedRoute>
          } />
          <Route path='/my-workouts' element={
            <ProtectedRoute requirePremium={true}>
              <MyWorkouts />
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path='/analytics' element={
            <ProtectedRoute requirePremium={true}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path='/updateprofile' element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          } />
          <Route path='/notifications' element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path='/plansmodel' element={
            <ProtectedRoute>
              <PlansModal />
            </ProtectedRoute>
          } />
          
          <Route path='/admin/dashboard' element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path='/admin/meals' element={
            <ProtectedRoute requireAdmin={true}>
              <AdminMeals />
            </ProtectedRoute>
          } />
          <Route path='/admin/revenue' element={
            <ProtectedRoute requireAdmin={true}>
              <AdminRevenue />
            </ProtectedRoute>
          } />
          <Route path='/admin/workouts' element={
            <ProtectedRoute requireAdmin={true}>
              <AdminWorkouts />
            </ProtectedRoute>
          } />
          <Route path='/admin/users' element={
            <ProtectedRoute requireAdmin={true}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path='/admin/subscriptions' element={
            <ProtectedRoute requireAdmin={true}>
              <AdminSubscriptions />
            </ProtectedRoute>
          } />
          <Route path='/admin/profile' element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProfile />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

export default App
