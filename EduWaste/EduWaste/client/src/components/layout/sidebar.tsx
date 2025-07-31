import { Link, useLocation } from "wouter";
import { Leaf, BarChart3, Trophy, Lightbulb, User } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Leaderboards", href: "/leaderboard", icon: Trophy },
  { name: "Suggestions", href: "/suggestions", icon: Lightbulb },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">EduWaste</h1>
        </div>
        <p className="text-sm text-gray-600 mt-1">Waste Management System</p>
      </div>
      
      <nav className="mt-6">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 transition-colors ${
                isActive
                  ? "text-green-600 bg-green-50 border-r-2 border-green-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="ml-3 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-6 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Pappu Kashyap</p>
            <p className="text-xs text-gray-600">X Fire</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
