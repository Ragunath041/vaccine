import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Clock, X, CheckCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { appointments as appointmentsApi, children as childrenApi, doctors as doctorsApi } from "@/services/api";

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
  onAppointmentBooked?: () => void;
  onViewVaccinationRecords?: () => void;
}

export const AppointmentsList = ({ 
  appointments, 
  onAppointmentBooked,
  onViewVaccinationRecords
}: AppointmentsListProps) => {
  // Filter appointments by status
  const upcomingAppointments = appointments.filter(
    app => app.status === "pending" || app.status === "confirmed"
  );
  
  const completedAppointments = appointments.filter(
    app => app.status === "completed"
  );
  
  // State for booking appointment dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [children, setChildren] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const { toast } = useToast();
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If switching to completed tab, refresh vaccination records
    if (value === "completed" && onViewVaccinationRecords) {
      onViewVaccinationRecords();
    }
  };
  
  // Fetch children and doctors when dialog opens
  const handleOpenDialog = async () => {
    try {
      // Fetch children
      const childrenResponse = await childrenApi.getAll();
      setChildren(childrenResponse.data);
      
      // Fetch doctors
      const doctorsResponse = await doctorsApi.getAll();
      setDoctors(doctorsResponse.data);
      
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load required data"
      });
    }
  };
  
  // Handle booking appointment
  const handleBookAppointment = async () => {
    try {
      // Validate required fields
      if (!selectedChild || !selectedDoctor || !appointmentDate || !appointmentTime || !reason) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields"
        });
        return;
      }

      const appointmentData = {
        child_id: selectedChild,
        doctor_id: selectedDoctor,
        date: appointmentDate,
        time: appointmentTime,
        reason: reason,
        notes: notes || null
      };

      console.log("Sending appointment data:", appointmentData);

      const response = await appointmentsApi.create(appointmentData);
      console.log("Appointment created:", response.data);

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });

      // Reset form fields
      setSelectedChild("");
      setSelectedDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");
      setNotes("");
      setIsDialogOpen(false);
      
      // Notify parent component to refresh appointments
      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment"
      });
    }
  };
  
  // Handle viewing appointment details
  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };

  // Handle canceling appointment
  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      // In a real app, you would call an API to cancel the appointment
      // For now, we'll just show a success message
      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been cancelled successfully.",
      });
      
      setIsCancelDialogOpen(false);
      
      // Notify parent component to refresh appointments
      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel appointment"
      });
    }
  };

  // Open cancel dialog
  const openCancelDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelDialogOpen(true);
  };
  
  const renderAppointmentCard = (appointment: Appointment) => (
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
        {appointment.status === "confirmed" && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Confirmed
          </span>
        )}
        {appointment.status === "pending" && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        )}
        {appointment.status === "completed" && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCheck className="h-3 w-3 mr-1" />
            Completed
          </span>
        )}
        <Button variant="outline" size="sm" onClick={() => handleViewDetails(appointment)}>Details</Button>
        {appointment.status !== "completed" && (
          <Button variant="destructive" size="sm" onClick={() => openCancelDialog(appointment)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Cancel</span>
          </Button>
        )}
      </div>
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
        <CardDescription>
          View and manage your vaccination appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Appointments</h2>
            <Button 
              onClick={() => handleOpenDialog()}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </Button>
          </div>
          
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No upcoming appointments scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => renderAppointmentCard(appointment))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {completedAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No completed appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedAppointments.map(appointment => renderAppointmentCard(appointment))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Book Appointment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Book Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="child">Select Child *</Label>
                <select 
                  id="child" 
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select a child</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.first_name} {child.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Select Doctor *</Label>
                <select 
                  id="doctor" 
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Date *</Label>
                <Input 
                  id="appointmentDate" 
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentTime">Time *</Label>
                <Input 
                  id="appointmentTime" 
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Input 
                  id="reason" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter the reason for the appointment"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input 
                  id="notes" 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any additional notes"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleBookAppointment}>Book Appointment</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Appointment Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4 py-4">
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">{selectedAppointment.childName}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedAppointment.vaccineName}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedAppointment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-gray-500">{selectedAppointment.time}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Doctor</p>
                  <p className="text-sm text-gray-500">{selectedAppointment.doctorName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm">
                    {selectedAppointment.status === "confirmed" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Confirmed
                      </span>
                    )}
                    {selectedAppointment.status === "pending" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    )}
                    {selectedAppointment.status === "completed" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <CheckCheck className="h-3 w-3 mr-1" />
                        Completed
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Cancel Appointment Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cancel Appointment</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to cancel this appointment?</p>
              {selectedAppointment && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                  <p className="font-medium">{selectedAppointment.childName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                  </p>
                  <p className="text-sm text-gray-500">{selectedAppointment.doctorName}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>No, Keep It</Button>
              <Button variant="destructive" onClick={handleCancelAppointment}>Yes, Cancel</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
