import React, { useState, useRef } from 'react';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Ruler, 
  Scale, 
  Save,
  Camera,
  MapPin
} from 'lucide-react';

export default function Profile() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    heightUnit: 'ft',
    weight: '',
    weightUnit: 'lbs',
    country: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    console.log('Profile image:', profileImage);
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'physical', label: 'Physical Stats', icon: Scale }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h2>
              <p className="text-gray-600">Complete your profile to get personalized fitness recommendations</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-8">
                  <div className="text-center mb-6">
                    <div 
                      onClick={handleProfilePictureClick}
                      className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 relative cursor-pointer hover:opacity-80 transition-opacity group"
                    >
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={32} className="text-white" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full flex items-center justify-center transition-all">
                        <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">Profile Photo</h3>
                    <p className="text-sm text-gray-500">Click to upload your photo</p>
                  </div>

                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const IconComponent = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                            activeSection === section.id
                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                          }`}
                        >
                          <IconComponent size={20} />
                          <span className="font-medium">{section.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                  
                  {activeSection === 'personal' && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <User size={24} className="text-blue-600" />
                        <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                          <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                          <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email"
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                          <div className="relative">
                            <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Enter your phone number"
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                          <div className="relative">
                            <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                          <div className="relative">
                            <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              placeholder="Enter your country"
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'physical' && (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <Scale size={24} className="text-blue-600" />
                        <h3 className="text-2xl font-bold text-gray-800">Physical Statistics</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Height</label>
                          <div className="flex space-x-2">
                            <div className="relative flex-1">
                              <Ruler size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleInputChange}
                                placeholder="Enter height"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <select
                              name="heightUnit"
                              value={formData.heightUnit}
                              onChange={handleInputChange}
                              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="ft">ft/in</option>
                              <option value="cm">cm</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Weight</label>
                          <div className="flex space-x-2">
                            <div className="relative flex-1">
                              <Scale size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                placeholder="Enter weight"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <select
                              name="weightUnit"
                              value={formData.weightUnit}
                              onChange={handleInputChange}
                              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="lbs">lbs</option>
                              <option value="kg">kg</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Save Profile</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
