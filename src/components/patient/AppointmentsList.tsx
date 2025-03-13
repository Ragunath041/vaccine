
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, X } from "lucide-react";

interface Appointment {
  id: string;
  childName: string;
  vaccineName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
}

export const AppointmentsList = ({ appointments }: AppointmentsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>
          View and manage your scheduled vaccination appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No appointments scheduled</p>
            <Button className="mt-4">Book Appointment</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map(appointment => (
              <div 
                key={appointment.id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1 mb-3 md:mb-0">
                  <h4 className="font-medium">{appointment.childName} - {appointment.vaccineName}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{appointment.time}</span>
                  </div>
                  <p className="text-sm">{appointment.doctorName}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {appointment.status === "confirmed" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Confirmed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </span>
                  )}
                  <Button variant="outline" size="sm">Details</Button>
                  <Button variant="destructive" size="sm">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end mt-6">
              <Button>Schedule New Appointment</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
