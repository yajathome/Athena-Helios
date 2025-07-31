import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import StatsCards from "@/components/dashboard/stats-cards";
import WasteChart from "@/components/dashboard/waste-chart";
import ClassLeaderboard from "@/components/dashboard/class-leaderboard";
import WasteBreakdown from "@/components/dashboard/waste-breakdown";

import SuggestedFixes from "@/components/dashboard/suggested-fixes";
import WasteReportForm from "@/components/janitor/waste-report-form";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalWaste: number;
  recycled: number;
  wasteByType: Record<string, number>;
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="Waste Management Dashboard"
          subtitle="Real-time tracking and analytics for sustainable schools"
        />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const todayImpact = stats ? `${stats.totalWaste.toFixed(1)}kg Waste Tracked` : "Loading...";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Waste Management Dashboard"
        subtitle="Real-time tracking and analytics for sustainable schools"
        todayImpact={todayImpact}
      />
      
      <div className="p-6">
        {stats && (
          <>
            <StatsCards
              todayWaste={stats.totalWaste}
              recycled={stats.recycled}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <WasteChart wasteByType={stats.wasteByType} />
              <ClassLeaderboard />
            </div>

            <WasteBreakdown wasteByType={stats.wasteByType} />



            <SuggestedFixes />

            {/* Educational Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                <span className="text-blue-600 mr-2">🎓</span>
                Did You Know?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-red-600 text-xs">❗</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Primary schools generate 45kg waste per pupil annually</p>
                      <p className="text-xs text-gray-600 mt-1">That's equivalent to 180 plastic bottles per student!</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-orange-600 text-xs">📊</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">70% of school waste is food, paper, and card</p>
                      <p className="text-xs text-gray-600 mt-1">Most of this can be composted or recycled!</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-600 text-xs">♻️</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">80% of school waste is recyclable</p>
                      <p className="text-xs text-gray-600 mt-1">But only 20% actually gets recycled properly</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-600 text-xs">🌍</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Punjab schools create 620+ tonnes waste daily</p>
                      <p className="text-xs text-gray-600 mt-1">Imagine the impact across all of India!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">
                  <span className="mr-2">🤝</span>
                  How We Can Help
                </h4>
                <p className="text-sm text-green-700">Track, Manage, and Reduce waste using licensed waste carriers around India! Every small action counts towards a sustainable future.</p>
              </div>
            </div>
          </>
        )}

        
        <WasteReportForm>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
            size="icon"
          >
            <span className="text-xl">+</span>
          </Button>
        </WasteReportForm>
      </div>
    </div>
  );
}
