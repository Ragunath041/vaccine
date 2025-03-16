import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  Users, 
  X,
  FileSpreadsheet,
  User2,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { appointments as appointmentsApi, children as childrenApi } from "@/services/api";

const DoctorDashboard = () => {
  const { user, role, loading } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  // Fetch appointments and children data
  const fetchData = async () => {
    try {
      if (!user) {
        console.log("No user available");
        return;
      }

      // Fetch appointments
      const appointmentsResponse = await appointmentsApi.getAll();
      console.log("Fetched appointments:", appointmentsResponse.data);
      setAppointments(appointmentsResponse.data);

      // Fetch all children for reference
      // In a real app, we would only fetch children related to the appointments
      // But for simplicity, we'll fetch all children
      try {
        // Get all children from localStorage
        const allChildren = [];
        const storedChildren = JSON.parse(localStorage.getItem('children') || '[]');
        
        // Only add children that have appointments with this doctor
        const doctorAppointments = appointmentsResponse.data;
        const childrenIds = doctorAppointments.map(app => app.child_id);
        const uniqueChildrenIds = [...new Set(childrenIds)];
        
        for (const childId of uniqueChildrenIds) {
          const child = storedChildren.find(c => c.id === childId);
          if (child) {
            allChildren.push(child);
          }
        }
        
        console.log("Children with appointments:", allChildren);
        setChildren(allChildren);
      } catch (error) {
        console.error("Error fetching children:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch children data"
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch required data"
      });
    }
  };

  useEffect(() => {
    if (user && role === "doctor") {
      fetchData();
    }
  }, [user, role]);

  if (loading) return null;

  // If not logged in or not a doctor, redirect to login
  if (!user || role !== "doctor") {
    return <Navigate to="/login" />;
  }

  // Get child name from child ID
  const getChildName = (childId) => {
    const child = children.find(c => c.id === childId);
    return child ? `${child.first_name} ${child.last_name}` : "Unknown Child";
  };

  // Calculate child age from date of birth
  const getChildAge = (childId) => {
    const child = children.find(c => c.id === childId);
    if (!child) return "Unknown";
    
    const dob = new Date(child.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    if (age === 0) {
      // Calculate months for infants
      const monthAge = today.getMonth() - dob.getMonth() + 
        (today.getFullYear() - dob.getFullYear()) * 12;
      return `${monthAge} month${monthAge !== 1 ? 's' : ''}`;
    }
    
    return `${age} year${age !== 1 ? 's' : ''}`;
  };

  // Handle accepting an appointment
  const handleAcceptAppointment = async (appointment) => {
    try {
      const response = await appointmentsApi.accept(appointment.id);
      console.log("Appointment accepted:", response.data);
      
      // Update the appointments list
      setAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app.id === appointment.id ? response.data : app
        )
      );
      
      toast({
        title: "Appointment Accepted",
        description: `Appointment with ${getChildName(appointment.child_id)} has been confirmed.`
      });
    } catch (error) {
      console.error("Error accepting appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept appointment"
      });
    }
  };

  // Open rejection dialog
  const openRejectDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setRejectionReason("");
    setIsRejectDialogOpen(true);
  };

  // Handle rejecting an appointment
  const handleRejectAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      const response = await appointmentsApi.reject(selectedAppointment.id, rejectionReason);
      console.log("Appointment rejected:", response.data);
      
      // Update the appointments list
      setAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app.id === selectedAppointment.id ? response.data : app
        )
      );
      
      toast({
        title: "Appointment Rejected",
        description: `Appointment with ${getChildName(selectedAppointment.child_id)} has been rejected.`
      });
      
      // Close the dialog
      setIsRejectDialogOpen(false);
      setSelectedAppointment(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject appointment"
      });
    }
  };

  // Handle completing an appointment
  const handleCompleteAppointment = async (appointment) => {
    try {
      console.log("Completing appointment:", appointment);
      const response = await appointmentsApi.complete(appointment.id);
      console.log("Appointment completed:", response.data);
      
      // Update the appointments list
      setAppointments(prevAppointments => 
        prevAppointments.map(app => 
          app.id === appointment.id ? response.data : app
        )
      );
      
      toast({
        title: "Appointment Completed",
        description: `Appointment with ${getChildName(appointment.child_id)} has been marked as completed.`
      });
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete appointment"
      });
    }
  };

  // Filter appointments based on status
  const upcomingAppointments = appointments.filter(app => 
    app.status === 'pending' || app.status === 'confirmed'
  );
  
  const completedAppointments = appointments.filter(app => 
    app.status === 'completed'
  );
  
  const rejectedAppointments = appointments.filter(app => 
    app.status === 'rejected' || app.status === 'cancelled'
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-8 px-4">
        <div className="container max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600">Welcome back, Dr. {user.firstName} {user.lastName}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-8 w-8 text-amber-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {appointments.filter(a => a.status === 'pending').length}
                      </p>
                      <p className="text-sm text-gray-500">Need review</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Confirmed Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {appointments.filter(a => a.status === 'confirmed').length}
                      </p>
                      <p className="text-sm text-gray-500">Upcoming</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{children.length}</p>
                      <p className="text-sm text-gray-500">Total patients</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Appointment Management</CardTitle>
              <CardDescription>View and manage your appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="upcoming">
                    Upcoming ({upcomingAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({completedAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected/Cancelled ({rejectedAppointments.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  {upcomingAppointments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingAppointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">
                              {getChildName(appointment.child_id)}
                            </TableCell>
                            <TableCell>{getChildAge(appointment.child_id)}</TableCell>
                            <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>{appointment.reason}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                appointment.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {appointment.status === 'pending' && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                                      onClick={() => handleAcceptAppointment(appointment)}
                                    >
                                      <ThumbsUp className="h-3 w-3" />
                                      Accept
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => openRejectDialog(appointment)}
                                    >
                                      <ThumbsDown className="h-3 w-3" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {appointment.status === 'confirmed' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={() => handleCompleteAppointment(appointment)}
                                  >
                                    <Check className="h-3 w-3" />
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No upcoming appointments
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed">
                  {completedAppointments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedAppointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">
                              {getChildName(appointment.child_id)}
                            </TableCell>
                            <TableCell>{getChildAge(appointment.child_id)}</TableCell>
                            <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>{appointment.reason}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No completed appointments
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rejected">
                  {rejectedAppointments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Rejection Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rejectedAppointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">
                              {getChildName(appointment.child_id)}
                            </TableCell>
                            <TableCell>{getChildAge(appointment.child_id)}</TableCell>
                            <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                            <TableCell>{appointment.time}</TableCell>
                            <TableCell>{appointment.reason}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {appointment.rejection_reason || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No rejected or cancelled appointments
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      
      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Appointment</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectAppointment}
              disabled={!rejectionReason.trim()}
            >
              Reject Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
