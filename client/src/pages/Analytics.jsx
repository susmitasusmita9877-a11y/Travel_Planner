// client/src/pages/Analytics.jsx - UPDATED WITH RUPEES
import React, { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import api from '../api/axios';
import {
  FaPlane, FaDollarSign, FaCalendarAlt, FaMapMarkerAlt,
  FaTrophy, FaGlobeAmericas, FaChartLine, FaDownload
} from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalSpent: 0,
    totalDays: 0,
    countriesVisited: 0,
    avgTripCost: 0,
    mostExpensive: null,
    favoriteDestination: null,
    budgetUtilization: 0
  });
  const [spendingByCategory, setSpendingByCategory] = useState({});
  const [spendingOverTime, setSpendingOverTime] = useState([]);
  const [tripsByMonth, setTripsByMonth] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trips');
      const tripsData = res.data;
      setTrips(tripsData);
      calculateStats(tripsData);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tripsData) => {
    if (tripsData.length === 0) {
      setLoading(false);
      return;
    }

    const totalTrips = tripsData.length;

    const totalSpent = tripsData.reduce((sum, trip) => {
      const tripExpenses = (trip.expenses || []).reduce(
        (s, e) => s + Number(e.amount || 0),
        0
      );
      return sum + tripExpenses;
    }, 0);

    const totalDays = tripsData.reduce((sum, trip) => {
      if (trip.startDate && trip.endDate) {
        const days = Math.max(
          1,
          Math.ceil(
            (new Date(trip.endDate) - new Date(trip.startDate)) /
              (1000 * 60 * 60 * 24)
          )
        );
        return sum + days;
      }
      return sum;
    }, 0);

    const destinations = new Set(
      tripsData.map((t) => t.destination).filter(Boolean)
    );
    const countriesVisited = destinations.size;

    const avgTripCost = totalTrips > 0 ? totalSpent / totalTrips : 0;

    const tripsWithCost = tripsData.map((trip) => ({
      ...trip,
      cost: (trip.expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0)
    }));
    const mostExpensive = tripsWithCost.sort((a, b) => b.cost - a.cost)[0];

    const destCount = {};
    tripsData.forEach((trip) => {
      if (trip.destination) {
        destCount[trip.destination] = (destCount[trip.destination] || 0) + 1;
      }
    });
    const favoriteDestination = Object.entries(destCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    const totalBudget = tripsData.reduce((sum, trip) => sum + Number(trip.budget || 0), 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const categorySpending = {};
    tripsData.forEach((trip) => {
      (trip.expenses || []).forEach((expense) => {
        const cat = expense.category || 'Misc';
        categorySpending[cat] = (categorySpending[cat] || 0) + Number(expense.amount || 0);
      });
    });
    setSpendingByCategory(categorySpending);

    const monthlySpending = {};
    tripsData.forEach((trip) => {
      (trip.expenses || []).forEach((expense) => {
        if (expense.date) {
          const month = new Date(expense.date).toLocaleString('default', {
            month: 'short',
            year: 'numeric'
          });
          monthlySpending[month] = (monthlySpending[month] || 0) + Number(expense.amount || 0);
        }
      });
    });
    setSpendingOverTime(monthlySpending);

    const tripsByMonthData = {};
    tripsData.forEach((trip) => {
      if (trip.startDate) {
        const month = new Date(trip.startDate).toLocaleString('default', {
          month: 'short',
          year: 'numeric'
        });
        tripsByMonthData[month] = (tripsByMonthData[month] || 0) + 1;
      }
    });
    setTripsByMonth(tripsByMonthData);

    setStats({
      totalTrips,
      totalSpent,
      totalDays,
      countriesVisited,
      avgTripCost,
      mostExpensive,
      favoriteDestination,
      budgetUtilization
    });
  };

  const exportReport = () => {
    const csvData = [
      ['Travel Analytics Report'],
      [''],
      ['Summary Statistics'],
      ['Total Trips', stats.totalTrips],
      ['Total Spent', `₹${stats.totalSpent.toFixed(2)}`],
      ['Total Days Traveled', stats.totalDays],
      ['Countries Visited', stats.countriesVisited],
      ['Average Trip Cost', `₹${stats.avgTripCost.toFixed(2)}`],
      ['Budget Utilization', `${stats.budgetUtilization.toFixed(1)}%`],
      [''],
      ['Spending by Category'],
      ...Object.entries(spendingByCategory).map(([cat, amount]) => [cat, `₹${amount.toFixed(2)}`])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'travel-analytics.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="skeleton h-12 w-64 mb-8"></div>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card"><div className="skeleton h-20"></div></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaChartLine size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Yet</h2>
          <p className="text-gray-600 mb-6">Start creating trips to see your travel analytics</p>
        </div>
      </div>
    );
  }

  const categoryChartData = {
    labels: Object.keys(spendingByCategory),
    datasets: [{
      data: Object.values(spendingByCategory),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
      borderWidth: 0
    }]
  };

  const spendingTimelineData = {
    labels: Object.keys(spendingOverTime),
    datasets: [{
      label: 'Spending (₹)',
      data: Object.values(spendingOverTime),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const tripsTimelineData = {
    labels: Object.keys(tripsByMonth),
    datasets: [{
      label: 'Number of Trips',
      data: Object.values(tripsByMonth),
      backgroundColor: '#10b981',
      borderRadius: 8
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Analytics</h1>
            <p className="text-gray-600">Your travel journey visualized</p>
          </div>
          <button onClick={exportReport} className="btn btn-outline flex items-center gap-2">
            <FaDownload />
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Trips"
            value={stats.totalTrips}
            icon={<FaPlane />}
            color="blue"
          />
          <StatCard
            title="Total Spent"
            value={`₹${stats.totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            icon={<FaDollarSign />}
            color="green"
          />
          <StatCard
            title="Days Traveled"
            value={stats.totalDays}
            icon={<FaCalendarAlt />}
            color="purple"
          />
          <StatCard
            title="Destinations"
            value={stats.countriesVisited}
            icon={<FaMapMarkerAlt />}
            color="orange"
          />
        </div>

        {/* Insights Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <FaTrophy />
              </div>
              <div className="text-sm text-blue-700 font-medium">Most Expensive Trip</div>
            </div>
            {stats.mostExpensive && (
              <>
                <div className="text-xl font-bold text-blue-900">{stats.mostExpensive.title}</div>
                <div className="text-blue-700">₹{stats.mostExpensive.cost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </>
            )}
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                <FaGlobeAmericas />
              </div>
              <div className="text-sm text-green-700 font-medium">Favorite Destination</div>
            </div>
            <div className="text-xl font-bold text-green-900">
              {stats.favoriteDestination || 'N/A'}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                <FaDollarSign />
              </div>
              <div className="text-sm text-purple-700 font-medium">Avg Trip Cost</div>
            </div>
            <div className="text-xl font-bold text-purple-900">
              ₹{stats.avgTripCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-purple-700">
              Budget utilization: {stats.budgetUtilization.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Spending by Category</h3>
            <div className="h-64">
              <Doughnut
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.label + ': ₹' + context.parsed.toLocaleString('en-IN');
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Trips by Month</h3>
            <div className="h-64">
              <Bar
                data={tripsTimelineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Spending Timeline */}
        <div className="card">
          <h3 className="font-semibold text-lg mb-4">Spending Over Time</h3>
          <div className="h-80">
            <Line
              data={spendingTimelineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return 'Spending: ₹' + context.parsed.y.toLocaleString('en-IN');
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `₹${value.toLocaleString('en-IN')}`
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="card hover-lift">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 ${colorClasses[color]} rounded-xl flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}