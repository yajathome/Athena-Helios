import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Leaf, Zap, Car, TreePine } from "lucide-react";

export default function CarbonFootprint() {
  const { data: carbonData } = useQuery<Record<string, number>>({
    queryKey: ["/api/analytics/carbon-footprint"],
  });

  const totalCarbon = carbonData ? Object.values(carbonData).reduce((sum, value) => sum + value, 0) / 1000 : 0;

  const carbonEquivalents = [
    {
      icon: Car,
      label: "Car driving",
      value: `${(totalCarbon * 0.13).toFixed(1)} km`,
      color: "text-red-600 bg-red-100",
    },
    {
      icon: Zap,
      label: "Energy consumption",
      value: `${(totalCarbon * 0.5).toFixed(1)} kWh`,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      icon: TreePine,
      label: "Trees needed to offset",
      value: `${Math.ceil(totalCarbon / 22)} trees`,
      color: "text-green-600 bg-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Carbon Footprint Calculator"
        subtitle="Track and understand the environmental impact of school waste"
      />
      
      <div className="p-6">
        
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6 border border-green-200 mb-8">
          <div className="text-center">
            <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {totalCarbon.toFixed(1)} kg CO₂
            </h2>
            <p className="text-gray-600">Total carbon footprint today</p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {carbonEquivalents.map((item) => {
            const Icon = item.icon;
            
            return (
              <div key={item.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color} mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.label}</h3>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
              </div>
            );
          })}
        </div>

        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Carbon Footprint by Waste Type</h3>
          <div className="space-y-4">
            {carbonData && Object.entries(carbonData).map(([type, carbon]) => {
              const carbonInKg = carbon / 1000;
              const percentage = (carbon / Object.values(carbonData).reduce((sum, val) => sum + val, 0)) * 100;
              
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800 capitalize">
                      {type.replace("_", " ")}
                    </span>
                    <span className="text-sm text-gray-600">{carbonInKg.toFixed(1)}kg CO₂</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of total emissions</div>
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            🌱 Carbon Reduction Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Reduce Food Waste</h4>
                <p className="text-sm text-green-700">
                  Take only what you can eat. Food waste has the highest carbon impact due to methane emissions in landfills.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Proper Segregation</h4>
                <p className="text-sm text-blue-700">
                  Correct waste sorting enables better recycling, reducing the need for new raw materials.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Reuse Materials</h4>
                <p className="text-sm text-yellow-700">
                  Use both sides of paper, refill bottles, and repurpose materials before disposing.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">Digital First</h4>
                <p className="text-sm text-purple-700">
                  Opt for digital notes and assignments when possible to reduce paper consumption.
                </p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🔥 Carbon Footprint Facts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-2xl font-bold text-orange-600 mb-2">4.3x</p>
              <p className="text-sm text-gray-600">Food waste produces 4.3 times more CO₂ than its weight</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-2xl font-bold text-red-600 mb-2">6x</p>
              <p className="text-sm text-gray-600">Plastic items generate 6 times their weight in CO₂</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-2xl font-bold text-green-600 mb-2">22kg</p>
              <p className="text-sm text-gray-600">One tree absorbs 22kg of CO₂ annually</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
