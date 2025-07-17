import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

export default function AddWorkoutModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    exercises: [{ name: '', sets: 1, reps: 1, duration: 0, restTime: 30 }]
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validExercises = formData.exercises?.filter(ex => ex.name.trim()) || [];
    if (validExercises.length === 0) {
      alert('Please add at least one exercise with a name.');
      return;
    }
    
    const newWorkout = {
      name: formData.name,
      description: formData.description || '',
      category: formData.category?.toLowerCase(),
      difficulty: formData.difficulty?.toLowerCase(),
      duration: parseInt(formData.duration),
      estimatedCalories: parseInt(formData.estimatedCalories) || 0,
      exercises: validExercises,
      equipment: formData.equipment ? formData.equipment.split(',').map(item => {
        const trimmed = item.trim().toLowerCase();
        const validEquipment = ['none', 'dumbbells', 'barbell', 'resistance-bands', 'kettlebell', 'medicine-ball', 'yoga-mat', 'pull-up-bar', 'bench', 'treadmill', 'stationary-bike', 'other'];
        return validEquipment.includes(trimmed) ? trimmed : 'other';
      }) : [],
      targetMuscles: formData.targetMuscles ? formData.targetMuscles.split(',').map(item => {
        const trimmed = item.trim().toLowerCase();
        const validMuscles = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'obliques', 'glutes', 'quadriceps', 'hamstrings', 'calves', 'full-body'];
        return validMuscles.includes(trimmed) ? trimmed : 'full-body';
      }) : [],
      image: typeof formData.image === 'string' ? formData.image : '💪',
      isPublic: true
    };
    
    console.log('Form data being submitted:', newWorkout);
    onSave(newWorkout);
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({...formData, image: file});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Add New Workout</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter workout name"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
                <option value="hiit">HIIT</option>
                <option value="yoga">Yoga</option>
                <option value="pilates">Pilates</option>
                <option value="crossfit">CrossFit</option>
                <option value="bodyweight">Bodyweight</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                required
              >
                <option value="">Select Difficulty</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (min)</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="30"
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="dumbbells, barbell, none (comma separated)"
                onChange={(e) => setFormData({...formData, equipment: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">Valid options: none, dumbbells, barbell, resistance-bands, kettlebell, medicine-ball, yoga-mat, pull-up-bar, bench, treadmill, stationary-bike, other</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Calories Burned</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="250"
                onChange={(e) => setFormData({...formData, estimatedCalories: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              rows="4"
              placeholder="Enter workout description, benefits, and overview..."
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Muscles</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="chest, back, shoulders (comma separated)"
              onChange={(e) => setFormData({...formData, targetMuscles: e.target.value})}
            />
            <p className="text-xs text-gray-500 mt-1">Valid options: chest, back, shoulders, biceps, triceps, forearms, abs, obliques, glutes, quadriceps, hamstrings, calves, full-body</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Exercises</label>
            {formData.exercises?.map((exercise, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 mb-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-700">Exercise {index + 1}</h4>
                  {formData.exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newExercises = formData.exercises.filter((_, i) => i !== index);
                        setFormData({...formData, exercises: newExercises});
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Exercise name"
                    value={exercise.name}
                    onChange={(e) => {
                      const newExercises = [...formData.exercises];
                      newExercises[index].name = e.target.value;
                      setFormData({...formData, exercises: newExercises});
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Sets"
                    value={exercise.sets}
                    onChange={(e) => {
                      const newExercises = [...formData.exercises];
                      newExercises[index].sets = parseInt(e.target.value) || 1;
                      setFormData({...formData, exercises: newExercises});
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={exercise.reps}
                    onChange={(e) => {
                      const newExercises = [...formData.exercises];
                      newExercises[index].reps = parseInt(e.target.value) || 1;
                      setFormData({...formData, exercises: newExercises});
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Rest time (seconds)"
                    value={exercise.restTime}
                    onChange={(e) => {
                      const newExercises = [...formData.exercises];
                      newExercises[index].restTime = parseInt(e.target.value) || 30;
                      setFormData({...formData, exercises: newExercises});
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newExercises = [...(formData.exercises || []), { name: '', sets: 1, reps: 1, duration: 0, restTime: 30 }];
                setFormData({...formData, exercises: newExercises});
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors"
            >
              + Add Exercise
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Workout Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Workout preview" 
                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({...formData, image: null});
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <label className="cursor-pointer">
                      <span className="text-purple-600 hover:text-purple-700 font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all font-medium shadow-lg"
            >
              Add Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
