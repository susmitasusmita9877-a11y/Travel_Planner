import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetChart({ expenses = [] }) {
  const categories = ['Transportation', 'Food', 'Accommodation', 'Misc'];
  
  const data = {
    labels: categories,
    datasets: [{
      data: categories.map(cat => 
        expenses
          .filter(e => e.category === cat)
          .reduce((sum, e) => sum + Number(e.amount || 0), 0)
      ),
      backgroundColor: [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#8b5cf6'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="card">
      <h4 className="font-semibold mb-4">Expense Breakdown</h4>
      <Pie data={data} options={options} />
    </div>
  );
}