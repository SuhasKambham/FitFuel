import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWorkouts, addWorkout, updateWorkout, deleteWorkout } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaDumbbell, FaPlus, FaTrash, FaEdit, FaClock, FaFire, FaCalendarAlt } from 'react-icons/fa';

type Workout = {
  _id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  notes?: string;
  date: string;
};

const WorkoutLog = () => {
  const { token } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    calories: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const data = await getWorkouts(token!);
      setWorkouts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const workoutPayload = {
        type: formData.type.toLowerCase(),
        date: formData.date,
        duration: Number(formData.duration),
        caloriesBurned: Number(formData.calories),
        notes: formData.notes
      };
      if (editingWorkout) {
        // Update workout logic
        await updateWorkout(token!, editingWorkout._id, workoutPayload);
      } else {
        await addWorkout(token!, workoutPayload);
      }
      setFormData({ type: '', duration: '', calories: '', notes: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      setEditingWorkout(null);
      fetchWorkouts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save workout');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
    try {
      await deleteWorkout(token!, id);
      fetchWorkouts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete workout');
      }
    }
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setFormData({
      type: workout.type.charAt(0).toUpperCase() + workout.type.slice(1),
      duration: workout.duration.toString(),
      calories: workout.caloriesBurned.toString(),
      notes: workout.notes || '',
      date: workout.date ? workout.date.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(59, 130, 246, 0.3)',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#a0aec0', fontSize: '16px', margin: 0 }}>
            Loading your workouts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        padding: 'clamp(12px, 4vw, 32px)',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{
              fontSize: 'clamp(22px, 5vw, 32px)',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0
            }}>
              Workout Log
            </h1>
            <button
              onClick={() => setShowForm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <FaPlus style={{ fontSize: '14px' }} />
              Add Workout
            </button>
          </div>
          <p style={{
            fontSize: '16px',
            color: '#a0aec0',
            margin: 0
          }}>
            Track your fitness activities and monitor your progress
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              padding: '16px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)'
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Add/Edit Workout Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              marginBottom: '32px',
              width: '95.1%',
              maxWidth: 'none',
              marginLeft: 0,
              marginRight: 0
            }}
          >
            <h2 style={{
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 24px 0'
            }}>
              {editingWorkout ? 'Edit Workout' : 'Add New Workout'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                width: '100%'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>Workout Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)'
                    }}
                    required
                  >
                    <option value="" disabled>Select type</option>
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="yoga">Yoga</option>
                    <option value="hiit">HIIT</option>
                    <option value="zumba">Zumba</option>
                    <option value="weight training">Weight Training</option>
                    <option value="mobility">Mobility</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)'
                    }}
                    required
                    placeholder='YYYY-MM-DD'
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)'
                    }}
                    placeholder='Duration (min)'
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>Calories Burned</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={e => setFormData({ ...formData, calories: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)'
                    }}
                    placeholder='Calories'
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  style={{
                    width: '97.5%',
                    padding: '12px 16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#ffffff',
                    backdropFilter: 'blur(10px)',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="How was your workout?"
                />
        </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingWorkout(null);
                    setFormData({ type: '', duration: '', calories: '', notes: '', date: new Date().toISOString().split('T')[0] });
                  }}
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#a0aec0',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {editingWorkout ? 'Update Workout' : 'Add Workout'}
        </button>
              </div>
      </form>
          </motion.div>
        )}

        {/* Workouts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
        {workouts.length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '48px 24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              textAlign: 'center'
            }}>
              <FaDumbbell style={{
                fontSize: '48px',
                color: '#718096',
                marginBottom: '16px'
              }} />
              <h3 style={{
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: '600',
                margin: '0 0 8px 0'
              }}>
                No workouts yet
              </h3>
              <p style={{
                color: '#a0aec0',
                fontSize: '16px',
                margin: '0 0 24px 0'
              }}>
                Start tracking your fitness journey by adding your first workout
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaPlus style={{ fontSize: '14px' }} />
                Add Your First Workout
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(12px, 2vw, 24px)'
            }}>
              {workouts.map((workout: Workout) => (
                <motion.div
                  key={workout._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                      }}>
                        <FaDumbbell style={{ color: 'white', fontSize: '16px' }} />
                      </div>
                      <div>
                        <h3 style={{
                          color: '#ffffff',
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: '0 0 4px 0'
                        }}>
                          {workout.type}
                        </h3>
                        <p style={{
                          color: '#a0aec0',
                          fontSize: '14px',
                          margin: 0
                        }}>
                          {(() => {
                            const d = new Date(workout.date);
                            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                          })()}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(workout)}
                        style={{
                          padding: '6px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                      >
                        <FaEdit style={{ fontSize: '12px' }} />
                      </button>
                      <button
                        onClick={() => handleDelete(workout._id)}
                        style={{
                          padding: '6px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                      >
                        <FaTrash style={{ fontSize: '12px' }} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaClock style={{ color: '#718096', fontSize: '14px' }} />
                      <span style={{ color: '#e2e8f0', fontSize: '14px' }}>
                        {workout.duration} min
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaFire style={{ color: '#f59e0b', fontSize: '14px' }} />
                      <span style={{ color: '#e2e8f0', fontSize: '14px' }}>
                        {workout.caloriesBurned} cal
                      </span>
                    </div>
                  </div>
                  {workout.notes && (
                    <p style={{
                      color: '#a0aec0',
                      fontSize: '14px',
                      margin: '8px 0 0 0',
                      lineHeight: '1.5',
                      fontStyle: 'italic'
                    }}>
                      {workout.notes}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        select option {
          background: #1a1a2e;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default WorkoutLog; 