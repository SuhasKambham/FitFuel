import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWorkouts, getMeals } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaDumbbell, FaUtensils, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaFire, FaClock } from 'react-icons/fa';

// Add types for meals and workouts
interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
interface Meal {
  _id: string;
  mealType: string;
  notes?: string;
  date: string;
  foodItems: FoodItem[];
}
interface Workout {
  _id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  notes?: string;
  date: string;
}

const Calendar = () => {
  const { token } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workoutsData, mealsData] = await Promise.all([
        getWorkouts(token!),
        getMeals(token!)
      ]);
      setWorkouts(workoutsData);
      setMeals(mealsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toLocaleDateString('en-GB');
    const dayWorkouts = workouts.filter((w: Workout) => {
      const wDate = new Date(w.date).toLocaleDateString('en-GB');
      return wDate === dateStr;
    });
    const dayMeals = meals.filter((m: Meal) => {
      const mDate = new Date(m.date).toLocaleDateString('en-GB');
      return mDate === dateStr;
    });
    return { workouts: dayWorkouts, meals: dayMeals };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Helper to sum nutrition for a meal
  const getMealTotals = (foodItems: FoodItem[]) => {
    return foodItems.reduce(
      (totals, item) => ({
        calories: totals.calories + (Number(item.calories) || 0),
        protein: totals.protein + (Number(item.protein) || 0),
        carbs: totals.carbs + (Number(item.carbs) || 0),
        fat: totals.fat + (Number(item.fat) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  // Helper to title case meal type
  const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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
            border: '3px solid rgba(249, 115, 22, 0.3)',
            borderTop: '3px solid #f97316',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#a0aec0', fontSize: '16px', margin: 0 }}>
            Loading your calendar...
          </p>
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const selectedEvents = getEventsForDate(selectedDate);

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
          <h1 style={{
            fontSize: 'clamp(22px, 5vw, 32px)',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 8px 0'
          }}>
            Calendar
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#a0aec0',
            margin: 0
          }}>
            View your fitness activities and meals by date
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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 'clamp(12px, 2vw, 24px)'
        }}>
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Calendar Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <button
                onClick={goToPreviousMonth}
                style={{
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#a0aec0',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                <FaChevronLeft style={{ fontSize: '14px' }} />
              </button>
              <h2 style={{
                color: '#ffffff',
                fontSize: '20px',
                fontWeight: '600',
                margin: 0
              }}>
                {formatDate(currentDate)}
              </h2>
              <button
                onClick={goToNextMonth}
                style={{
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#a0aec0',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                <FaChevronRight style={{ fontSize: '14px' }} />
              </button>
            </div>

            {/* Today Button */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button
                onClick={goToToday}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(249, 115, 22, 0.1)',
                  color: '#f97316',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(249, 115, 22, 0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)'}
              >
                Today
              </button>
            </div>

            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px'
            }}>
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#718096'
                }}>
                  {day}
        </div>
              ))}

              {/* Calendar Days */}
              {days.map((day, index) => {
                if (!day) {
                  return (
                    <div key={index} style={{
                      height: '60px',
                      background: 'transparent'
                    }} />
                  );
                }

                const events = getEventsForDate(day);
                const hasWorkouts = events.workouts.length > 0;
                const hasMeals = events.meals.length > 0;

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    style={{
                      height: '60px',
                      padding: '8px',
                      background: isSelected(day) 
                        ? 'rgba(249, 115, 22, 0.2)' 
                        : isToday(day)
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'transparent',
                      border: isSelected(day) 
                        ? '1px solid rgba(249, 115, 22, 0.5)'
                        : '1px solid transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                    onMouseEnter={e => !isSelected(day) && (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                    onMouseLeave={e => !isSelected(day) && !isToday(day) && (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: isToday(day) ? '#f97316' : '#e2e8f0',
                      marginBottom: '4px'
                    }}>
                      {day.getDate()}
                    </span>
                    
                    {/* Event Indicators */}
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {hasWorkouts && (
                        <div style={{
                          width: '6px',
                          height: '6px',
                          background: '#3b82f6',
                          borderRadius: '50%'
                        }} />
                      )}
                      {hasMeals && (
                        <div style={{
                          width: '6px',
                          height: '6px',
                          background: '#10b981',
                          borderRadius: '50%'
                        }} />
                      )}
                      </div>
                  </button>
                );
              })}
        </div>
          </motion.div>

          {/* Events Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <h3 style={{
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaCalendarAlt style={{ color: '#f97316' }} />
              {selectedDate.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>

            {selectedEvents.workouts.length === 0 && selectedEvents.meals.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '32px 16px'
              }}>
                <FaCalendarAlt style={{
                  fontSize: '32px',
                  color: '#718096',
                  marginBottom: '12px'
                }} />
                <p style={{
                  color: '#a0aec0',
                  fontSize: '14px',
                  margin: 0
                }}>
                  No activities scheduled for this date
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Workouts */}
                {selectedEvents.workouts.length > 0 && (
                  <div>
                    <h4 style={{
                      color: '#3b82f6',
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaDumbbell />
                      Workouts ({selectedEvents.workouts.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedEvents.workouts.map((workout: Workout) => (
                        <div key={workout._id} style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          borderRadius: '10px',
                          padding: '12px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: 'column',
                          marginBottom: '8px'
                        }}>
                          <div style={{ width: '100%' }}>
                            <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500', margin: '0 0 4px 0' }}>{workout.type}</p>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
                              <span style={{ color: '#a0aec0', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FaClock style={{ fontSize: '10px' }} />
                                {workout.duration} min
                              </span>
                              <span style={{ color: '#a0aec0', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <FaFire style={{ fontSize: '10px' }} />
                                {workout.caloriesBurned} cal
                              </span>
                            </div>
                          </div>
                          {/* Show notes/comment if present */}
                          {workout.notes && (
                            <p style={{
                              color: '#a0aec0',
                              fontSize: '13px',
                              margin: '8px 0 0 0',
                              lineHeight: '1.5',
                              fontStyle: 'italic'
                            }}>
                              {workout.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meals */}
                {selectedEvents.meals.length > 0 && (
              <div>
                    <h4 style={{
                      color: '#10b981',
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaUtensils />
                      Meals ({selectedEvents.meals.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedEvents.meals.map((meal: Meal) => {
                        const totals = getMealTotals(meal.foodItems || []);
                        return (
                          <div key={meal._id} style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '10px',
                            padding: '12px'
                          }}>
                            <p style={{
                              color: '#ffffff',
                              fontSize: '14px',
                              fontWeight: '600',
                              margin: '0 0 4px 0',
                              letterSpacing: '0.5px'
                            }}>
                              {toTitleCase(meal.mealType)}
                            </p>
                            <p style={{
                              color: '#a0aec0',
                              fontSize: '13px',
                              margin: '0 0 4px 0',
                              fontWeight: 500
                            }}>
                              Total: {totals.calories} cal | {totals.protein}g Protein | {totals.carbs}g Carbs | {totals.fat}g Fat
                            </p>
                            {/* List food items */}
                            {meal.foodItems && meal.foodItems.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {meal.foodItems.map((item: FoodItem, idx: number) => (
                                  <div key={idx} style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    borderRadius: '6px',
                                    padding: '6px 10px',
                                    marginBottom: '2px',
                                    color: '#e2e8f0',
                                    fontSize: '13px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}>
                                    <span>{item.name}</span>
                                    <span style={{ color: '#f59e0b' }}>{item.calories} cal</span>
                                    <span style={{ color: '#3b82f6' }}>Protein: {item.protein}g</span>
                                    <span style={{ color: '#10b981' }}>Carbs: {item.carbs}g</span>
                                    <span style={{ color: '#8b5cf6' }}>Fat: {item.fat}g</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Show notes/comment if present */}
                            {meal.notes && (
                              <p style={{
                                color: '#a0aec0',
                                fontSize: '13px',
                                margin: '8px 0 0 0',
                                lineHeight: '1.5',
                                fontStyle: 'italic'
                              }}>
                                {meal.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* Day total section */}
                    {(() => {
                      const dayTotals = selectedEvents.meals.reduce((tot, meal) => {
                        const t = getMealTotals(meal.foodItems || []);
                        return {
                          calories: tot.calories + t.calories,
                          protein: tot.protein + t.protein,
                          carbs: tot.carbs + t.carbs,
                          fat: tot.fat + t.fat
                        };
                      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
                      return (
                        <div style={{
                          marginTop: '18px',
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.15)',
                          borderRadius: '10px',
                          padding: '12px',
                          color: '#10b981',
                          fontWeight: 600,
                          fontSize: '15px',
                          textAlign: 'center',
                          letterSpacing: '0.5px'
                        }}>
                          Day Total: {dayTotals.calories} cal | {dayTotals.protein}g Protein | {dayTotals.carbs}g Carbs | {dayTotals.fat}g Fat
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Calendar; 