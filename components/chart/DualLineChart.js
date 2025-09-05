import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

const DualLineChart = ({ chartData }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [timeFilter, setTimeFilter] = useState('monthly');


  // Define raw data structure for each time filter
  const rawData = {
    daily: {
      labels: chartData?.daily?.labels || [],
      visitData: chartData?.daily?.visitData || [],
      chatData: chartData?.daily?.chatData || [],
      highestVisitCount: chartData?.daily?.highestVisitCount || 0
    },
    weekly: {
      labels: chartData?.weekly?.labels || [],
      visitData: chartData?.weekly?.visitData || [],
      chatData: chartData?.weekly?.chatData || [],
      highestVisitCount: chartData?.weekly?.highestVisitCount || 0
    },
    monthly: {
      labels: chartData?.monthly?.labels || [],
      visitData: chartData?.monthly?.visitData || [],
      chatData: chartData?.monthly?.chatData || [],
      highestVisitCount: chartData?.monthly?.highestVisitCount || 0
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const { labels, visitData, chatData, highestVisitCount } = rawData[timeFilter];

    chartRef.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Visit',
            data: visitData,
            borderColor: '#FFB1B7',
            backgroundColor: '#FFB1B7',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#FFB1B7',
            pointBorderColor: '#FFB1B7',
            pointRadius: 6,
            pointHoverRadius: 8,
          },
          {
            label: 'Chat',
            data: chatData,
            borderColor: '#70B6C1',
            backgroundColor: '#70B6C1',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#70B6C1',
            pointBorderColor: '#70B6C1',
            pointRadius: 6,
            pointHoverRadius: 8,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: '#f0f0f0', lineWidth: 1 },
            ticks: { color: '#666', font: { size: 12 } },
            border: { display: false }
          },
          y: {
            min: 0,
            max: highestVisitCount,
            grid: { color: '#f0f0f0', lineWidth: 1 },
            ticks: {
              color: '#666',
              font: { size: 12 },
              callback: function (value) {
                if (value >= 1000) {
                  return (value / 1000) + 'k';
                }
                return value;
              }
            },
            border: { display: false }
          }
        },
        elements: { point: { hoverBorderWidth: 0 } }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [timeFilter]);

  return (
    <>
      <div className="lead-visit-container-sec">
        <div className="lead-visit-container-info">
          <h6>Staticis</h6>
          <h3>Lead to Visit Conversion Rate</h3>
        </div>
        <div className="inner-filter-sec">
          {['daily', 'weekly', 'monthly'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`bar-filter-btn ${timeFilter === filter ? 'active' : ''}`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full p-4 bg-white">
        <div style={{ height: '280px', width: '100%' }}>
          <canvas ref={canvasRef} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </>
  );
};

export default DualLineChart;
