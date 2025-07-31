import Header from "@/components/layout/header";
import { BookOpen, Recycle, Leaf, Users, Globe, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";
import { WASTE_CATEGORIES } from "@/lib/constants";

export default function Education() {
  const wasteStats = [
    {
      icon: AlertTriangle,
      title: "Primary School Waste",
      value: "45kg",
      description: "Generated per pupil annually",
      detail: "That's equivalent to 180 plastic bottles per student!",
      color: "text-red-600 bg-red-100",
    },
    {
      icon: TrendingDown,
      title: "Secondary School Waste",
      value: "22kg",
      description: "Generated per pupil annually",
      detail: "Half of primary but still significant impact",
      color: "text-orange-600 bg-orange-100",
    },
    {
      icon: Recycle,
      title: "Recyclable Waste",
      value: "80%",
      description: "Of school waste is recyclable",
      detail: "But only 20% actually gets recycled properly",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: Globe,
      title: "Punjab Schools",
      value: "620+ tonnes",
      description: "Waste created daily",
      detail: "Imagine the impact across all of India!",
      color: "text-purple-600 bg-purple-100",
    },
  ];

  const wasteComposition = [
    {
      category: "Food, Paper & Card",
      percentage: 70,
      color: "bg-red-500",
      description: "Most of this can be composted or recycled!",
    },
    {
      category: "Plastic Materials",
      percentage: 15,
      color: "bg-blue-500",
      description: "Requires proper segregation for recycling",
    },
    {
      category: "Electronic Waste",
      percentage: 8,
      color: "bg-purple-500",
      description: "Contains valuable materials but needs special handling",
    },
    {
      category: "Other Materials",
      percentage: 7,
      color: "bg-gray-500",
      description: "Mixed materials requiring careful sorting",
    },
  ];

  const sustainabilityTips = [
    {
      title: "The 5 R's of Waste Management",
      items: [
        "Refuse - Say no to unnecessary items",
        "Reduce - Use less when possible",
        "Reuse - Find new purposes for items",
        "Recycle - Process materials into new products",
        "Rot - Compost organic waste naturally",
      ],
      icon: "♻️",
    },
    {
      title: "Smart Segregation Tips",
      items: [
        "Clean containers before recycling",
        "Know your plastic recycling codes (1-7)",
        "Separate biodegradable from non-biodegradable",
        "Keep e-waste separate from regular waste",
        "Use color-coded bins consistently",
      ],
      icon: "🗂️",
    },
    {
      title: "Campus Conservation",
      items: [
        "Use both sides of paper",
        "Bring reusable water bottles",
        "Pack lunch in reusable containers",
        "Switch off lights and fans",
        "Report water leaks immediately",
      ],
      icon: "🏫",
    },
    {
      title: "Digital Solutions",
      items: [
        "Take digital notes when possible",
        "Submit assignments electronically",
        "Use QR codes for information sharing",
        "Organize digital study groups",
        "Read e-books instead of printed books",
      ],
      icon: "📱",
    },
  ];

  const environmentalFacts = [
    {
      fact: "1 plastic bottle takes 450 years to decompose",
      impact: "Every bottle not recycled pollutes for centuries",
      icon: "🍼",
    },
    {
      fact: "1 tree absorbs 22kg of CO₂ annually",
      impact: "Paper recycling saves trees and reduces emissions",
      icon: "🌳",
    },
    {
      fact: "Food waste produces methane gas",
      impact: "Methane is 25x more potent than CO₂ as a greenhouse gas",
      icon: "🍽️",
    },
    {
      fact: "1 ton of recycled paper saves 17 trees",
      impact: "Also saves 7,000 gallons of water and energy",
      icon: "📄",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Environmental Education Hub"
        subtitle="Learn about waste management, sustainability, and environmental impact"
      />
      
      <div className="p-6">
        
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">School Waste Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wasteStats.map((stat, index) => {
              const Icon = stat.icon;
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 mb-2">{stat.description}</p>
                  <p className="text-xs text-gray-500">{stat.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">What Makes Up School Waste?</h3>
          <div className="space-y-4">
            {wasteComposition.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">{item.category}</span>
                  <span className="text-sm text-gray-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Know Your Waste Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(WASTE_CATEGORIES).slice(0, 10).map(([key, category]) => (
              <div key={key} className={`text-center p-4 ${category.bgColor} rounded-lg border ${category.borderColor}`}>
                <div className="text-2xl mb-2">{category.icon}</div>
                <h4 className="text-sm font-medium text-gray-800 mb-1">{category.label}</h4>
                <p className="text-xs text-gray-600">{category.weight}g avg</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Leaf className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Sustainability Best Practices</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sustainabilityTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">{tip.icon}</span>
                  <h3 className="font-semibold text-gray-800">{tip.title}</h3>
                </div>
                <ul className="space-y-2">
                  {tip.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Globe className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Environmental Impact Facts</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {environmentalFacts.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800 mb-2">{item.fact}</p>
                    <p className="text-sm text-gray-600">{item.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🚀 Take Action Today
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-gray-800">Start in Your Class</h4>
              </div>
              <p className="text-sm text-gray-600">Organize your classmates, create awareness, and implement small changes together.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Recycle className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-gray-800">Proper Segregation</h4>
              </div>
              <p className="text-sm text-gray-600">Learn the correct way to separate waste and teach others in your school.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Leaf className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-gray-800">Track Your Impact</h4>
              </div>
              <p className="text-sm text-gray-600">Use EduWaste to monitor your waste reduction and carbon footprint improvements.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            🌍 How We Can Make a Difference
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Track</h4>
              <p className="text-sm text-gray-600">Monitor waste generation patterns and identify problem areas using data-driven insights.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Manage</h4>
              <p className="text-sm text-gray-600">Implement systematic waste management with proper segregation and collection processes.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📉</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Reduce</h4>
              <p className="text-sm text-gray-600">Partner with licensed waste carriers across India to minimize environmental impact.</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <p className="text-green-800 font-medium">
              💚 Every small action counts towards a sustainable future for our planet!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
