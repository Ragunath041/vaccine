
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, User2 } from "lucide-react";

interface SummaryCardsProps {
  childrenCount: number;
  upcomingAppointmentsCount: number;
  completedVaccinationsCount: number;
}

export const SummaryCards = ({
  childrenCount,
  upcomingAppointmentsCount,
  completedVaccinationsCount,
}: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Summary Card 1 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Children</CardTitle>
          <CardDescription>Registered in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{childrenCount}</div>
            <User2 className="h-8 w-8 text-vaccine-blue opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Card 2 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
          <CardDescription>In the next 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{upcomingAppointmentsCount}</div>
            <Calendar className="h-8 w-8 text-vaccine-green opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Card 3 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Vaccinations</CardTitle>
          <CardDescription>Completed vaccinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{completedVaccinationsCount}</div>
            <CheckCircle2 className="h-8 w-8 text-vaccine-teal opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
