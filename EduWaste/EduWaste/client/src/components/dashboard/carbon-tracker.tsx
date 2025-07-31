import { useQuery } from "@tanstack/react-query";
import { FileText, Utensils, PillBottle } from "lucide-react";

export default function CarbonTracker() {
  const { data: carbonData } = useQuery<Record<string, number>>({
    queryKey: ["/api/analytics/carbon-footprint"],
  });

  if (!carbonData) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Carbon Footprint Tracker</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const categories = [
    {
      name: "Stock Paper",
      icon: FileText,
      carbon: (carbonData.stock_paper || 0) / 1000,
      items: "480 sheets × 5g",
    },
    {
      name: "Food Waste",
      icon: Utensils,
      carbon: (carbonData.food_waste || 0) / 1000,
      items: "8 servings × 532g",
    },
    {
      name: "Plastic Bottles",
      icon: PillBottle,
      carbon: (carbonData.plastic_bottles || 0) / 1000,
      items: "140 bottles × 25g",
    },
  ];

  const totalCarbon = Object.values(carbonData).reduce((sum, value) => sum + value, 0) / 1000;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Carbon Footprint Tracker</h3>
      <div className="space-y-4">
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{category.carbon.toFixed(1)}kg CO₂</p>
                <p className="text-xs text-gray-600">{category.items}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center space-x-2">
          <span className="text-orange-600">⚠️</span>
          <p className="text-sm font-medium text-orange-800">Daily CO₂ Impact</p>
        </div>
        <p className="text-lg font-bold text-orange-600 mt-1">{totalCarbon.toFixed(1)}kg CO₂</p>
        <p className="text-xs text-orange-700">Equivalent to {(totalCarbon * 0.13).toFixed(1)}km car drive</p>
      </div>
    </div>
  );
}
