import { Trash2, Recycle, Leaf, Star } from "lucide-react";

interface StatsCardsProps {
  todayWaste: number;
  recycled: number;
}

export default function StatsCards({ todayWaste, recycled }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Today's Waste</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{todayWaste.toFixed(1)}kg</p>
            <p className="text-green-600 text-sm mt-1">
              <span className="text-xs">↓</span> 8% vs yesterday
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Recycled</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{recycled.toFixed(1)}kg</p>
            <p className="text-green-600 text-sm mt-1">
              <span className="text-xs">↑</span> 15% vs yesterday
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Recycle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>


    </div>
  );
}
