import { Utensils, Recycle, Droplets, Leaf, Star, Droplet } from "lucide-react";

export default function SuggestedFixes() {
  const suggestions = [
    {
      title: "Reduce Food Waste",
      description: "Your class wastes 30% more food than average. Try smaller portions!",
      icon: Utensils,
      iconColor: "text-red-600",
      impact: "Potential: -8kg CO₂/week",
      impactIcon: Leaf,
      impactColor: "text-green-600",
    },
    {
      title: "Improve Segregation",
      description: "85% accuracy in plastic sorting. Target: 95%",
      icon: Recycle,
      iconColor: "text-green-600",
      impact: "Potential: +50 points/day",
      impactIcon: Star,
      impactColor: "text-blue-600",
    },
    {
      title: "Water Conservation",
      description: "Install sensor taps to reduce water wastage by 40%",
      icon: Droplets,
      iconColor: "text-cyan-600",
      impact: "Save: 200L/day",
      impactIcon: Droplet,
      impactColor: "text-cyan-600",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        <span className="text-yellow-500 mr-2">💡</span>
        Personalized Suggestions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          const ImpactIcon = suggestion.impactIcon;
          
          return (
            <div key={suggestion.title} className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <Icon className={`h-5 w-5 ${suggestion.iconColor}`} />
                <h4 className="font-medium text-gray-800">{suggestion.title}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
              <div className={`flex items-center text-xs ${suggestion.impactColor}`}>
                <ImpactIcon className="h-3 w-3 mr-1" />
                <span>{suggestion.impact}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
