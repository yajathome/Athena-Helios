import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { HOUSE_COLORS } from "@/lib/constants";
import { Trophy, Medal, Award } from "lucide-react";
import type { Class } from "@shared/schema";

interface LeaderboardClass extends Class {
  rank: number;
}

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardClass[]>({
    queryKey: ["/api/leaderboard"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="Class Leaderboard"
          subtitle="See how your class ranks in the sustainability challenge"
        />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return Trophy;
      case 2:
        return Medal;
      case 3:
        return Award;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-600 bg-yellow-100";
      case 2:
        return "text-gray-600 bg-gray-100";
      case 3:
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Class Leaderboard"
        subtitle="See how your class ranks in the sustainability challenge"
      />
      
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Overall Rankings</h2>
            <p className="text-gray-600 mt-1">Based on green points earned through sustainable practices</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {leaderboard?.map((classData) => {
              const RankIcon = getRankIcon(classData.rank);
              const houseColors = HOUSE_COLORS[classData.house];
              
              return (
                <div key={classData.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(classData.rank)}`}>
                        {RankIcon ? (
                          <RankIcon className="h-6 w-6" />
                        ) : (
                          <span className="text-lg font-bold">{classData.rank}</span>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{classData.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-sm px-2 py-1 rounded-full ${houseColors.bgColor} ${houseColors.color}`}>
                            {classData.house.charAt(0).toUpperCase() + classData.house.slice(1)} House
                          </span>
                          <span className="text-sm text-gray-600">Grade {classData.grade}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{classData.points.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Green Points</p>
                    </div>
                  </div>
                  
                  {classData.rank <= 3 && (
                    <div className="mt-4 text-sm text-gray-600">
                      {classData.rank === 1 && "🏆 Outstanding waste management and eco-friendly practices!"}
                      {classData.rank === 2 && "🥈 Excellent commitment to sustainability!"}
                      {classData.rank === 3 && "🥉 Great job promoting environmental awareness!"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">School Competition</h2>
            <p className="text-gray-600 mt-1">All classes competing for the top spot</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaderboard?.slice(0, 6).map((classData) => {
                const houseColors = HOUSE_COLORS[classData.house];
                
                return (
                  <div key={classData.id} className={`p-4 rounded-lg border-2 ${houseColors.borderColor} ${houseColors.bgColor}`}>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {classData.name}
                    </h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">{classData.points.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Rank #{classData.rank}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
