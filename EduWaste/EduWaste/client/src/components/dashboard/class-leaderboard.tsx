import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { HOUSE_COLORS } from "@/lib/constants";
import type { Class } from "@shared/schema";

interface LeaderboardClass extends Class {
  rank: number;
}

export default function ClassLeaderboard() {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardClass[]>({
    queryKey: ["/api/leaderboard"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Class Leaderboard</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const topClasses = leaderboard?.slice(0, 3) || [];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Class Leaderboard</h3>
      <div className="space-y-4">
        {topClasses.map((classData) => {
          const houseColors = HOUSE_COLORS[classData.house];
          
          return (
            <div key={classData.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${getRankBgColor(classData.rank)} rounded-full flex items-center justify-center`}>
                  <span className={`${getRankTextColor(classData.rank)} font-bold text-sm`}>
                    {classData.rank}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{classData.name}</p>
                  <p className={`text-xs ${houseColors.color}`}>
                    {classData.house.charAt(0).toUpperCase() + classData.house.slice(1)} House
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">{classData.points.toLocaleString()}</p>
                <p className="text-xs text-gray-600">points</p>
              </div>
            </div>
          );
        })}
      </div>
      <Button variant="ghost" className="w-full mt-4 text-green-600 hover:bg-green-50">
        View Full Leaderboard
      </Button>
    </div>
  );
}

function getRankBgColor(rank: number): string {
  switch (rank) {
    case 1:
      return "bg-yellow-100";
    case 2:
      return "bg-gray-100";
    case 3:
      return "bg-orange-100";
    default:
      return "bg-gray-100";
  }
}

function getRankTextColor(rank: number): string {
  switch (rank) {
    case 1:
      return "text-yellow-600";
    case 2:
      return "text-gray-600";
    case 3:
      return "text-orange-600";
    default:
      return "text-gray-600";
  }
}
