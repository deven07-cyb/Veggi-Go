import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, BarController, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

const MultiGroupChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [category, setCategory] = useState('fruits'); // ✅ default category

  // ✅ Prepare chart data
  const rawData = {
    fruits: {
      labels: data?.fruits?.labels || [],
      datasets: [
        {
          label: 'Total Kg',
          data: data?.fruits?.totalKg || [],
          backgroundColor: '#775DA6',
          borderRadius: 20,
          borderSkipped: false,
          barThickness: 12
        },
        {
          label: 'Selling Kg',
          data: data?.fruits?.sellingKg || [],
          backgroundColor: '#70B6C1',
          borderRadius: 20,
          borderSkipped: false,
          barThickness: 12
        },
        {
          label: 'Remaining Kg',
          data: data?.fruits?.remainingKg || [],
          backgroundColor: '#FFB1B7',
          borderRadius: 20,
          borderSkipped: false,
          barThickness: 12
        }
      ]
    },
    vegetables: {
      labels: data?.vegetables?.labels || [],
      datasets: [
        {
          label: 'Total Kg',
          data: data?.vegetables?.totalKg || [],
          backgroundColor: '#775DA6',
          borderRadius: 20,
          borderSkipped: false,
          barThickness: 12
        },
        {
          label: 'Selling Kg',
          data: data?.vegetables?.sellingKg || [],
          backgroundColor: '#70B6C1',
          borderRadius: 20,
          borderSkipped: false,
          barThickness: 12
        },
        {
          label: 'Remaining Kg',
          data: data?.vegetables?.remainingKg || [],
          backgroundColor: '#FFB1B7',
          borderRadius: 20,
          borderSkipped: false,
          barThickness: 12
        }
      ]
    },
    meat: {
      labels: data?.meat?.labels || [],
      datasets: [
        {
          label: 'Total Kg',
          data: data?.meat?.totalKg || [],
          backgroundColor: '#775DA6',
          borderRadius: 20,
          borderSkipped: false,
          barThickness: 12
        },
        {
          label: 'Selling Kg',
          data: data?.meat?.sellingKg || [],
          backgroundColor: '#70B6C1',
          borderRadius: 20,
          borderSkipped: false,
          barThickness: 12
        },
        {
          label: 'Remaining Kg',
          data: data?.meat?.remainingKg || [],
          backgroundColor: '#FFB1B7',
          borderRadius: 20,
          borderSkipped: false,
          barThickness: 12
        }
      ]
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { stacked: false, grid: { display: false } },
      y: { stacked: false, beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } }
    }
  };

  // ✅ Create / Update Chart
  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new ChartJS(ctx, {
      type: 'bar',
      data: rawData[category],
      options: chartOptions
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [category, data]);

  return (
    <div className="mb-12">
      <div className="bar-chart-intro-sec">
        <div className="inner-title-sec outer-title-sec">
          <h6>Statistics</h6>
          <h3>Daily Selling Summary</h3>
        </div>

        {/* ✅ Category Filter */}
        <div className="inner-filter-sec">
          {['fruits', 'vegetables', 'meat'].map((filter) => (
            <button
              key={filter}
              onClick={() => setCategory(filter)}
              className={`bar-filter-btn ${category === filter ? 'active' : ''}`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bar-chart-graph" style={{ height: '500px', width: '100%', maxWidth: '1500px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default MultiGroupChart;
