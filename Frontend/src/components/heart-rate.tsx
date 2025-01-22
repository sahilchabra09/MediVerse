import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title);

export default function HeartRateComponent() {
  const [ecgData, setEcgData] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);
  const [temperature, setTemperature] = useState<number | null>(null);

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "ECG Data",
        data: ecgData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          maxTicksLimit: 20,
        },
      },
      y: {
        title: {
          display: true,
          text: "ECG Value",
        },
        ticks: {
          stepSize: 100, // Set the interval between ticks to 100
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  async function fetchSensorData() {
    try {
      const response = await fetch(
        "https://rehab360.pythonanywhere.com/api/sensor-data/"
      );
      const data = await response.json();

      if (data.temperature) {
        // Adjusting temperature value
        setTemperature(data.temperature - 3);
      }

      // Adding ECG data and time
      const timeNow = new Date().toLocaleTimeString();
      if (data.ecg) {
        setEcgData((prevEcgData) => {
          const updatedEcgData = [...prevEcgData, ...data.ecg];
          return updatedEcgData.slice(-140);
        });
        setTimeLabels((prevLabels) => {
          const updatedLabels = [...prevLabels, timeNow];
          return updatedLabels.slice(-140);
        });
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="w-full h-2/3 p-4 bg-gray-900 text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Heart Rate (ECG) Graph</h2>
        {/* Chart Container */}
        <div className="relative w-full h-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Display Adjusted Temperature */}
      <div className="w-full h-auto mt-4 p-4 bg-gray-900 text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Temperature</h2>
        <p className="text-xl">
          {temperature !== null ? `${temperature.toFixed(2)} °C` : "Loading..."}
        </p>
      </div>
    </div>
  );
}
