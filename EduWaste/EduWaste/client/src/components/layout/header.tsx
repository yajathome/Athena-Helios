import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  todayImpact?: string;
  onReportWaste?: () => void;
}

export default function Header({ title, subtitle, todayImpact, onReportWaste }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {todayImpact && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Today's Impact</p>
              <p className="text-lg font-bold text-green-600">{todayImpact}</p>
            </div>
          )}
          {onReportWaste && (
            <Button onClick={onReportWaste} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Report Waste
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
