import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMeals, addMeal, updateMeal, deleteMeal } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaUtensils, FaPlus, FaTrash, FaEdit, FaAppleAlt, FaDrumstickBite, FaBreadSlice, FaLeaf } from 'react-icons/fa';

// Add interfaces at the top
interface FoodItem {
  name: string;
  calories: number | string;
  protein: number | string;
  carbs: number | string;
  fat: number | string;
}
interface Meal {
  _id: string;
  mealType: string;
  notes?: string;
  date: string;
  foodItems: FoodItem[];
}

const MealLog = () => {
  const { token } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [formData, setFormData] = useState({
    mealType: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    foodItems: [
      { name: '', calories: '', protein: '', carbs: '', fat: '' }
    ]
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const data = await getMeals(token!);
      setMeals(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mealPayload = {
        ...formData,
        foodItems: formData.foodItems.map(item => ({
          name: item.name,
          calories: Number(item.calories),
          protein: Number(item.protein),
          carbs: Number(item.carbs),
          fat: Number(item.fat)
        }))
      };
      if (editingMeal) {
        // Update meal logic
        await updateMeal(token!, editingMeal._id, mealPayload);
      } else {
        await addMeal(token!, mealPayload);
      }
      setFormData({
        mealType: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
        foodItems: [
          { name: '', calories: '', protein: '', carbs: '', fat: '' }
        ]
      });
      setShowForm(false);
      setEditingMeal(null);
      fetchMeals();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save meal');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await deleteMeal(token!, id);
        fetchMeals();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete meal');
      }
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setFormData({
      mealType: meal.mealType,
      notes: meal.notes || '',
      date: meal.date ? meal.date.split('T')[0] : new Date().toISOString().split('T')[0],
      foodItems: meal.foodItems && meal.foodItems.length > 0 ? meal.foodItems.map(item => ({
        name: item.name,
        calories: item.calories.toString(),
        protein: item.protein.toString(),
        carbs: item.carbs.toString(),
        fat: item.fat.toString()
      })) : [{ name: '', calories: '', protein: '', carbs: '', fat: '' }]
    });
    setShowForm(true);
  };

  const getMealIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return <FaAppleAlt />;
      case 'lunch':
        return <FaDrumstickBite />;
      case 'dinner':
        return <FaBreadSlice />;
      case 'snack':
        return <FaLeaf />;
      default:
        return <FaUtensils />;
    }
  };

  const getMealColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      case 'lunch':
        return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      case 'dinner':
        return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
      case 'snack':
        return 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
      default:
        return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    }
  };

  // Helper to sum nutrition
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

  // Helper to sum all meals for the day
  const getDayTotals = (meals: Meal[]) => {
    return meals.reduce((tot, meal) => {
      const t = getMealTotals(meal.foodItems || []);
      return {
        calories: tot.calories + t.calories,
        protein: tot.protein + t.protein,
        carbs: tot.carbs + t.carbs,
        fat: tot.fat + t.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
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
            border: '3px solid rgba(16, 185, 129, 0.3)',
            borderTop: '3px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#a0aec0', fontSize: '16px', margin: 0 }}>
            Loading your meals...
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
              Meal Log
            </h1>
          <button
              onClick={() => setShowForm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <FaPlus style={{ fontSize: '14px' }} />
              Add Meal
          </button>
        </div>
          <p style={{
            fontSize: '16px',
            color: '#a0aec0',
            margin: 0
          }}>
            Track your nutrition and maintain a healthy diet
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

        {/* Add/Edit Meal Form */}
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
              marginBottom: '32px'
            }}
          >
            <h2 style={{
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 24px 0'
            }}>
              {editingMeal ? 'Edit Meal' : 'Add New Meal'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                flexDirection: window.innerWidth < 700 ? 'column' : 'row',
                alignItems: 'flex-start',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#e2e8f0',
                    marginBottom: '8px'
                  }}>
                    Meal Type
                  </label>
                  <select
                    value={formData.mealType}
                    onChange={e => setFormData({ ...formData, mealType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)'
                    }}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#e2e8f0',
                    marginBottom: '8px'
                  }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)'
                    }}
                    required
                  />
                </div>
              </div>
              {/* Food Items Section */}
              <div style={{ margin: '20px 0' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#e2e8f0',
                  marginBottom: '8px'
                }}>
                  Food Items
                </label>
                {formData.foodItems.map((item: FoodItem, idx) => (
                  <div key={idx} style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '10px',
                    marginBottom: '10px',
                    alignItems: 'center'
                  }}>
                <input
                      type="text"
                      placeholder="Name"
                      value={item.name}
                      onChange={e => {
                        const newItems = [...formData.foodItems];
                        newItems[idx].name = e.target.value;
                        setFormData({ ...formData, foodItems: newItems });
                      }}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(255,255,255,0.03)', color: '#fff', marginBottom: window.innerWidth < 700 ? '12px' : '0' }}
                  required
                />
                <input
                  type="number"
                  placeholder="Calories"
                      value={item.calories}
                      onChange={e => {
                        const newItems = [...formData.foodItems];
                        newItems[idx].calories = e.target.value;
                        setFormData({ ...formData, foodItems: newItems });
                      }}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(255,255,255,0.03)', color: '#fff', marginBottom: window.innerWidth < 700 ? '12px' : '0' }}
                  required
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                      value={item.protein}
                      onChange={e => {
                        const newItems = [...formData.foodItems];
                        newItems[idx].protein = e.target.value;
                        setFormData({ ...formData, foodItems: newItems });
                      }}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(255,255,255,0.03)', color: '#fff', marginBottom: window.innerWidth < 700 ? '12px' : '0' }}
                  required
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                      value={item.carbs}
                      onChange={e => {
                        const newItems = [...formData.foodItems];
                        newItems[idx].carbs = e.target.value;
                        setFormData({ ...formData, foodItems: newItems });
                      }}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(255,255,255,0.03)', color: '#fff', marginBottom: window.innerWidth < 700 ? '12px' : '0' }}
                  required
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                      value={item.fat}
                      onChange={e => {
                        const newItems = [...formData.foodItems];
                        newItems[idx].fat = e.target.value;
                        setFormData({ ...formData, foodItems: newItems });
                      }}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #333', background: 'rgba(255,255,255,0.03)', color: '#fff', marginBottom: window.innerWidth < 700 ? '12px' : '0' }}
                  required
                />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = formData.foodItems.filter((_, i) => i !== idx);
                        setFormData({ ...formData, foodItems: newItems.length ? newItems : [{ name: '', calories: '', protein: '', carbs: '', fat: '' }] });
                      }}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', marginBottom: window.innerWidth < 700 ? '12px' : '0' }}
                      disabled={formData.foodItems.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, foodItems: [...formData.foodItems, { name: '', calories: '', protein: '', carbs: '', fat: '' }] })}
                  style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', marginTop: '8px', cursor: 'pointer', marginBottom: window.innerWidth < 700 ? '12px' : '0' }}
                >
                  Add Food Item
                </button>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#e2e8f0',
                  marginBottom: '8px'
                }}>
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  style={{
                    width: '100%',
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
                  placeholder="Any additional notes about this meal..."
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMeal(null);
                    setFormData({
                      mealType: '',
                      notes: '',
                      date: new Date().toISOString().split('T')[0],
                      foodItems: [
                        { name: '', calories: '', protein: '', carbs: '', fat: '' }
                      ]
                    });
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
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {editingMeal ? 'Update Meal' : 'Add Meal'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Totals Section */}
        {meals.length > 0 && (
          <div style={{
            marginBottom: '24px',
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
            Totals: {getDayTotals(meals).calories} cal | {getDayTotals(meals).protein}g Protein | {getDayTotals(meals).carbs}g Carbs | {getDayTotals(meals).fat}g Fat
          </div>
        )}

        {/* Meals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {meals.length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '48px 24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              textAlign: 'center'
            }}>
              <FaUtensils style={{
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
                No meals logged yet
              </h3>
              <p style={{
                color: '#a0aec0',
                fontSize: '16px',
                margin: '0 0 24px 0'
              }}>
                Start tracking your nutrition by adding your first meal
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FaPlus style={{ fontSize: '14px' }} />
                Add Your First Meal
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(12px, 2vw, 24px)'
            }}>
              {meals.map((meal: Meal) => {
                const totals = getMealTotals(meal.foodItems || []);
                return (
                <motion.div
                    key={meal._id}
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
                          background: getMealColor(meal.mealType),
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                        }}>
                          {React.cloneElement(getMealIcon(meal.mealType), {
                            style: { color: 'white', fontSize: '16px' }
                          })}
                        </div>
                  <div>
                          <h3 style={{
                            color: '#ffffff',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: '0 0 4px 0'
                          }}>
                            {toTitleCase(meal.mealType)}
                          </h3>
                          <p style={{
                            color: '#a0aec0',
                            fontSize: '14px',
                            margin: 0
                          }}>
                            {/* Format date as DD/MM/YYYY */}
                            {(() => {
                              const d = new Date(meal.date);
                              return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}`;
                            })()}
                          </p>
                    </div>
                  </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(meal)}
                          style={{
                            padding: '6px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                        >
                          <FaEdit style={{ fontSize: '12px' }} />
                    </button>
                        <button
                          onClick={() => handleDelete(meal._id)}
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center'
                      }}>
                        <p style={{ color: '#f59e0b', fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                          {totals.calories}
                        </p>
                        <p style={{ color: '#a0aec0', fontSize: '12px', margin: 0 }}>
                          Calories
                        </p>
                      </div>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center'
                      }}>
                        <p style={{ color: '#3b82f6', fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                          {totals.protein}g
                        </p>
                        <p style={{ color: '#a0aec0', fontSize: '12px', margin: 0 }}>
                          Protein
                        </p>
                      </div>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center'
                      }}>
                        <p style={{ color: '#10b981', fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                          {totals.carbs}g
                        </p>
                        <p style={{ color: '#a0aec0', fontSize: '12px', margin: 0 }}>
                          Carbs
                        </p>
                      </div>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '12px',
                        borderRadius: '10px',
                        textAlign: 'center'
                      }}>
                        <p style={{ color: '#8b5cf6', fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                          {totals.fat}g
                        </p>
                        <p style={{ color: '#a0aec0', fontSize: '12px', margin: 0 }}>
                          Fat
                        </p>
                      </div>
                    </div>
                    {/* Show notes/comment if present */}
                    {meal.notes && (
                      <p style={{
                        color: '#a0aec0',
                        fontSize: '14px',
                        margin: '8px 0 0 0',
                        lineHeight: '1.5',
                        fontStyle: 'italic'
                      }}>
                        {meal.notes}
                      </p>
                    )}
                </motion.div>
                );
              })}
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

export default MealLog; 