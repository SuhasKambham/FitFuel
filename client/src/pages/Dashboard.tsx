import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FaDumbbell, FaUtensils, FaFire, FaTrophy, FaArrowUp, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkouts, getMeals, getWorkoutAnalytics, getMealAnalytics } from '../services/api';

type PieData = { type: string; value: number };
type MealPieData = { mealType: string; calories: number };
type TrendData = { date: string; calories: number };

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalMeals: 0,
    caloriesBurned: 0,
    currentStreak: 0
  });
  const [workoutPie, setWorkoutPie] = useState<PieData[]>([]);
  const [mealPie, setMealPie] = useState<MealPieData[]>([]);
  const [mealTrend, setMealTrend] = useState<TrendData[]>([]);
  const [burnedTrend, setBurnedTrend] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [workouts, meals, workoutAnalytics, mealAnalytics] = await Promise.all([
          getWorkouts(token),
          getMeals(token),
          getWorkoutAnalytics(token),
          getMealAnalytics(token)
        ]);
        setStats({
          totalWorkouts: workouts.length,
          totalMeals: meals.length,
          caloriesBurned: workoutAnalytics?.totalCaloriesBurned || 0,
          currentStreak: workoutAnalytics?.currentStreak || 0
        });
        setMealTrend((mealAnalytics?.dailyCalories || []) as TrendData[]);
        setBurnedTrend((workoutAnalytics?.dailyCaloriesBurned || []) as TrendData[]);
        setWorkoutPie((workoutAnalytics?.typeDistribution || []) as PieData[]);
        setMealPie((mealAnalytics?.caloriesByMealType || []) as MealPieData[]);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  // Optionally, show a loading spinner if loading
  if (loading) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>Loading dashboard...</div>;
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
          <h1 style={{
            fontSize: 'clamp(22px, 5vw, 32px)',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 8px 0'
          }}>
            Welcome back! 👋
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#a0aec0',
            margin: 0
          }}>
            Here's your fitness overview for today
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(12px, 2vw, 24px)',
            marginBottom: 'clamp(16px, 4vw, 32px)'
          }}
        >
          {/* Total Workouts */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}>
                <FaDumbbell style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <FaArrowUp style={{ color: '#10b981', fontSize: '16px' }} />
            </div>
            <h3 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0' }}>
              Total Workouts
            </h3>
            <p style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: 0 }}>
              {stats.totalWorkouts}
            </p>
          </div>

          {/* Total Meals */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}>
                <FaUtensils style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <FaArrowUp style={{ color: '#10b981', fontSize: '16px' }} />
            </div>
            <h3 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0' }}>
              Total Meals
            </h3>
            <p style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: 0 }}>
              {stats.totalMeals}
            </p>
          </div>

          {/* Calories Burned */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
              }}>
                <FaFire style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <FaArrowUp style={{ color: '#10b981', fontSize: '16px' }} />
            </div>
            <h3 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0' }}>
              Calories Burned
            </h3>
            <p style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: 0 }}>
              {stats.caloriesBurned.toLocaleString()}
            </p>
          </div>

          {/* Current Streak */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}>
                <FaTrophy style={{ color: 'white', fontSize: '20px' }} />
              </div>
              <FaArrowUp style={{ color: '#10b981', fontSize: '16px' }} />
            </div>
            <h3 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0' }}>
              Current Streak
            </h3>
            <p style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700', margin: 0 }}>
              {stats.currentStreak} days
            </p>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 4vw, 32px)',
          width: '100%'
        }}>
          {/* First row: trend lines */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'clamp(12px, 2vw, 24px)',
            width: '100%'
          }}>
            {/* Calorie Intake Trend Line */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0' }}>
                Calorie Intake Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mealTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="#a0aec0" fontSize={12} />
                  <YAxis stroke="#a0aec0" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Calories Burned Trend Line */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0' }}>
                Calories Burned Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={burnedTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="date" stroke="#a0aec0" fontSize={12} />
                  <YAxis stroke="#a0aec0" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Second row: pie charts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'clamp(12px, 2vw, 24px)',
            width: '100%',
            alignItems: 'stretch',
            minHeight: '320px',
            marginBottom: 'clamp(24px, 6vw, 48px)'
          }}>
            {/* Workout Types Pie Chart */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              minWidth: '0',
              maxWidth: '100%',
              flexBasis: '0',
              margin: 0
            }}>
              <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0' }}>
                Workout Types
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={workoutPie} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
                    {workoutPie.map((entry: PieData, idx: number) => (
                      <Cell key={`cell-${idx}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#7c3aed', '#059669'][idx % 8]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Meal Calories by Type Pie Chart */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              minWidth: '0',
              maxWidth: '100%',
              flexBasis: '0',
              margin: 0
            }}>
              <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0' }}>
                Calories by Meal Type
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={mealPie} dataKey="calories" nameKey="mealType" cx="50%" cy="50%" outerRadius={80} label>
                    {mealPie.map((entry: MealPieData, idx: number) => (
                      <Cell key={`cell-mtype-${idx}`} fill={['#f59e0b', '#10b981', '#8b5cf6', '#06b6d4'][idx % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h3 style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0' }}>
            Quick Actions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <Link
              to="/workouts"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#3b82f6',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaPlus style={{ fontSize: '16px' }} />
              Log Workout
            </Link>
            <Link
              to="/meals"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#10b981',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaPlus style={{ fontSize: '16px' }} />
              Log Meal
            </Link>
            <Link
              to="/calendar"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#8b5cf6',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaCalendarAlt style={{ fontSize: '16px' }} />
              View Calendar
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 