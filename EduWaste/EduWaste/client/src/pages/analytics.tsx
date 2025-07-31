import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { BarChart3, TrendingUp, Users, Recycle } from "lucide-react";

export default function Analytics() {
  const { data: wasteTrends } = useQuery<Record<number, number>>({
    queryKey: ["/api/analytics/waste-trends"],
  });

  const { data: carbonData } = useQuery<Record<string, number>>({
    queryKey: ["/api/analytics/carbon-footprint"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Waste Analytics & Trends"
        subtitle="Deep insights into school waste patterns and environmental impact"
      />
      
      <div className="p-6">
        {/* Class-wise Waste Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Waste by Class</h3>
          </div>
          
          <div className="space-y-4">
            {wasteTrends && Object.entries(wasteTrends).map(([grade, weight]) => {
              const weightInKg = weight / 1000;
              const maxWeight = Math.max(...Object.values(wasteTrends)) / 1000;
              const percentage = maxWeight > 0 ? (weightInKg / maxWeight) * 100 : 0;
              
              const classNames = ["X Fire", "X Water", "X Air", "X Sky", "X Light"];
              const className = classNames[parseInt(grade) - 10] || `Class ${grade}`;
              
              return (
                <div key={grade} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-800">{className}</span>
                    <span className="text-sm text-gray-600">{weightInKg.toFixed(1)}kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carbon Footprint Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Carbon Footprint by Waste Type</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carbonData && Object.entries(carbonData).map(([type, carbon]) => {
              const carbonInKg = carbon / 1000;
              
              return (
                <div key={type} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 capitalize">
                    {type.replace("_", " ")}
                  </h4>
                  <p className="text-lg font-bold text-green-600 mt-1">
                    {carbonInKg.toFixed(1)}kg CO₂
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Total emissions
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Student Engagement</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium">Active participants</span>
                <span className="text-lg font-bold text-purple-600">847</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Daily reports</span>
                <span className="text-lg font-bold text-blue-600">156</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Segregation accuracy</span>
                <span className="text-lg font-bold text-green-600">87%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Recycle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Environmental Impact</h3>
            </div>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">2.4 tons</p>
                <p className="text-sm text-gray-600">Waste diverted from landfills</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">1,200kg</p>
                <p className="text-sm text-gray-600">CO₂ emissions reduced</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">95%</p>
                <p className="text-sm text-gray-600">Recycling efficiency</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Analytics Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Peak Waste Hours</h4>
              <p className="text-sm text-gray-600">Most waste is generated between 12-2 PM during lunch breaks</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Top Contributor</h4>
              <p className="text-sm text-gray-600">Canteen food waste accounts for 45% of total daily waste</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Best Performers</h4>
              <p className="text-sm text-gray-600">Senior grades (10-12) show better segregation practices</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Improvement Area</h4>
              <p className="text-sm text-gray-600">Plastic waste segregation needs attention in junior grades</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
