import { WASTE_CATEGORIES } from "@/lib/constants";
import { Utensils, PillBottle, FileText, Battery } from "lucide-react";

interface WasteBreakdownProps {
  wasteByType: Record<string, number>;
}

export default function WasteBreakdown({ wasteByType }: WasteBreakdownProps) {
  const getCategoryStats = (category: string) => {
    const totalWeight = Object.entries(wasteByType)
      .filter(([type]) => type.includes(category))
      .reduce((sum, [, weight]) => sum + weight, 0);
    
    return (totalWeight / 1000).toFixed(1); // Convert to kg
  };

  const categories = [
    {
      name: "Food Waste",
      icon: Utensils,
      weight: getCategoryStats("food"),
      avgWeight: "532g avg/item",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      name: "Plastic",
      icon: PillBottle,
      weight: getCategoryStats("plastic"),
      avgWeight: "25g avg/item",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Paper",
      icon: FileText,
      weight: getCategoryStats("paper"),
      avgWeight: "5g avg/item",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      name: "E-Waste",
      icon: Battery,
      weight: getCategoryStats("pen"),
      avgWeight: "30g avg/item",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },

  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Waste Category Breakdown</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <div key={category.name} className={`text-center p-4 ${category.bgColor} rounded-lg`}>
              <div className={`w-12 h-12 ${category.bgColor} rounded-full mx-auto mb-3 flex items-center justify-center border border-opacity-20`}>
                <Icon className={`h-6 w-6 ${category.color}`} />
              </div>
              <p className="text-sm font-medium text-gray-800">{category.name}</p>
              <p className={`text-lg font-bold ${category.color} mt-1`}>
                {category.weight}kg
              </p>
              <p className="text-xs text-gray-600">{category.avgWeight}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
