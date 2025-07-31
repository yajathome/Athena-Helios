import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { WASTE_CATEGORIES } from "@/lib/constants";

Chart.register(...registerables);

interface WasteChartProps {
  wasteByType: Record<string, number>;
}

export default function WasteChart({ wasteByType }: WasteChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const data = Object.entries(wasteByType).filter(([, weight]) => weight > 0);
    
    // placeholderr
    if (data.length === 0) {
      chartInstanceRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["No Data"],
          datasets: [
            {
              data: [1],
              backgroundColor: ["#E5E7EB"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
      return;
    }

    const labels = data.map(([type]) => WASTE_CATEGORIES[type as keyof typeof WASTE_CATEGORIES]?.label || type.replace("_", " "));
    const values = data.map(([, weight]) => weight); // Keep in grams for better visibility

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6", "#10B981", 
              "#F97316", "#EC4899", "#6366F1", "#84CC16", "#6B7280"
            ],
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value}g (${percentage}%)`;
              }
            }
          }
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [wasteByType]);

  const hasData = Object.values(wasteByType).some(weight => weight > 0);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Waste Categories (Today)</h3>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="h-64 relative">
        <canvas ref={chartRef} className="w-full h-full"></canvas>
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 text-sm">No waste data recorded today</p>
              <p className="text-gray-400 text-xs mt-1">Start reporting waste to see the breakdown</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
