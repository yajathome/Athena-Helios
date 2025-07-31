import { useQuery } from "@tanstack/react-query";
import { Check, Recycle, X, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Activity } from "@shared/schema";

export default function RecentActivities() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activities</h3>
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

  const getActivityIcon = (type: string, points: number) => {
    if (points > 0) {
      return type === "cleanup_drive" ? Recycle : Check;
    } else {
      return type === "bin_status" ? AlertTriangle : X;
    }
  };

  const getActivityColor = (points: number) => {
    if (points > 0) return "bg-green-100 text-green-600";
    if (points < 0) return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  const getPointsColor = (points: number) => {
    if (points > 0) return "bg-green-100 text-green-600";
    if (points < 0) return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activities</h3>
      <div className="space-y-4">
        {activities?.slice(0, 4).map((activity) => {
          const Icon = getActivityIcon(activity.type, activity.points);
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.points)}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{activity.description}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getPointsColor(activity.points)}`}>
                {activity.points > 0 ? "+" : ""}{activity.points} pts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
