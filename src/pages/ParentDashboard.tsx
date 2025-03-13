import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { Plus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SummaryCards } from "@/components/patient/SummaryCards";
import { PatientTabs } from "@/components/patient/PatientTabs";
import { Chatbot } from "@/components/patient/Chatbot";
import { MapButton } from "@/components/patient/MapButton";
import { MOCK_CHILDREN, MOCK_APPOINTMENTS, MOCK_VACCINATION_HISTORY } from "@/lib/mockData";

// Add this constant at the top of your file, outside the component
const DOCTORS = [
  { doctor_id: 1, first_name: 'Arun', last_name: 'Patel', specialization: 'Pediatrician' },
  { doctor_id: 2, first_name: 'Priya', last_name: 'Sharma', specialization: 'Vaccination Specialist' },
  { doctor_id: 3, first_name: 'Rajesh', last_name: 'Kumar', specialization: 'Child Specialist' },
  { doctor_id: 4, first_name: 'Deepa', last_name: 'Gupta', specialization: 'Pediatrician' },
  { doctor_id: 5, first_name: 'Suresh', last_name: 'Verma', specialization: 'Immunologist' },
  { doctor_id: 6, first_name: 'Anita', last_name: 'Singh', specialization: 'Pediatrician' },
  { doctor_id: 7, first_name: 'Vikram', last_name: 'Malhotra', specialization: 'Child Specialist' }
];

const ParentDashboard = () => {
  const { user, role, loading } = useAuth();
  const { toast } = useToast();
  const [childName, setChildName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [children, setChildren] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [isRecordsDialogOpen, setIsRecordsDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  console.log("User data:", user);

  // Function to fetch children
  const fetchChildren = async () => {
    try {
      // Make sure we have a user and id before making the request
      if (!user || !user.id) {
        console.log("No user ID available");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/children?parent_id=${user.id}`, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch children");
      }

      const data = await response.json();
      setChildren(data);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch children"
      });
    }
  };

  // Function to fetch appointments
  const fetchAppointments = async () => {
    try {
      // Make sure we have a user and id before making the request
      if (!user || !user.id) {
        console.log("No user ID available");
        return;
      }

      // Update to filter by parent_id
      const response = await fetch(`http://localhost:5000/api/appointments?parent_id=${user.id}`, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      console.log("Fetched appointments:", data); // Debug log
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch appointments"
      });
    }
  };

  // Fetch both children and appointments when component mounts
  useEffect(() => {
    if (user && role === "parent") {
      fetchChildren();
      fetchAppointments();
    }
  }, [user, role]);
  
  if (loading) return null;
  
  // If not logged in or not a parent, redirect to login
  if (!user || role !== "parent") {
    return <Navigate to="/login" />;
  }
  
  const handleAddChild = async () => {
    try {
      // Validate required fields
      if (!firstName || !lastName || !dateOfBirth || !gender) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields"
        });
        return;
      }

      // Get the parent_id from the logged-in user
      const parentId = user?.id;
      console.log("Parent ID:", parentId); // Debug log

      if (!parentId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Parent ID not available"
        });
        return;
      }

      const childData = {
        parent_id: parentId, // Explicitly include parent_id
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        gender: gender.toLowerCase(),
        blood_group: bloodGroup || null,
        allergies: allergies || null
      };

      console.log("Sending child data:", childData); // Debug log

      const response = await fetch("http://localhost:5000/api/children", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(childData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add child");
      }

      const data = await response.json();
      console.log("Response data:", data); // Debug log
      
      // Refresh the children list
      await fetchChildren();

      toast({
        title: "Success",
        description: `${firstName} ${lastName} has been added successfully!`,
      });

      // Reset form fields
      setFirstName("");
      setLastName("");
      setDateOfBirth("");
      setGender("");
      setBloodGroup("");
      setAllergies("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding child:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add child"
      });
    }
  };

  const handleBookAppointment = async () => {
    try {
      // More detailed debug logs
      console.log("=== APPOINTMENT DEBUG INFO ===");
      console.log("Selected Child (raw):", selectedChild);
      console.log("Selected Doctor (raw):", selectedDoctor);
      console.log("Date:", appointmentDate);
      console.log("Time:", appointmentTime);
      console.log("Reason:", reason);
      console.log("Notes:", notes);

      // Validate required fields
      if (!selectedChild || !selectedDoctor || !appointmentDate || !appointmentTime || !reason) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required fields"
        });
        return;
      }

      // Parse values to ensure they're correct format
      const childId = parseInt(selectedChild);
      const doctorId = parseInt(selectedDoctor);

      console.log("Child ID (parsed):", childId);
      console.log("Doctor ID (parsed):", doctorId);

      if (isNaN(childId) || isNaN(doctorId)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid child or doctor selection"
        });
        return;
      }

      // Create appointment data with explicit types
      const appointmentData = {
        child_id: childId,
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: "scheduled",
        reason: reason,
        notes: notes || "Bring previous medical records"
      };

      console.log("FINAL APPOINTMENT DATA:", JSON.stringify(appointmentData));

      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(appointmentData)
      });

      const responseText = await response.text();
      console.log("Raw API Response:", responseText);
      
      if (!response.ok) {
        let errorMessage = "Failed to book appointment";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw text
          errorMessage = responseText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Error parsing response:", e);
        data = { message: "Appointment created but response was not JSON" };
      }

      console.log("Appointment created:", data);

      // Refresh appointments list
      await fetchAppointments();

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
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment"
      });
    }
  };

  const fetchVaccinationRecords = async (childId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/children/${childId}/vaccination-records`, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vaccination records");
      }

      const data = await response.json();
      console.log("Fetched vaccination records:", data); // Debug log
      setVaccinationRecords(data);
      setIsRecordsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching vaccination records:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch vaccination records"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-8 px-4">
        <div className="container max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.firstName} {user.lastName}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Children</CardTitle>
                <CardDescription>Manage your children's profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {children.length > 0 ? (
                    <div className="space-y-4">
                      {children.map((child) => (
                        <div key={child.id} className="p-4 border rounded-lg">
                          <h3 className="font-semibold">{child.first_name} {child.last_name}</h3>
                          <p className="text-sm text-gray-600">Date of Birth: {new Date(child.date_of_birth).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Gender: {child.gender}</p>
                          {child.blood_group && <p className="text-sm text-gray-600">Blood Group: {child.blood_group}</p>}
                          {child.allergies && <p className="text-sm text-gray-600">Allergies: {child.allergies}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No children added yet</p>
                  )}
                  
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Child
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Child</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input 
                              id="firstName" 
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input 
                              id="lastName" 
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input 
                            id="dateOfBirth" 
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender *</Label>
                          <select 
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full border rounded-md p-2"
                            required
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bloodGroup">Blood Group</Label>
                          <select
                            id="bloodGroup"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="w-full border rounded-md p-2"
                          >
                            <option value="">Select blood group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="allergies">Allergies</Label>
                          <Input 
                            id="allergies" 
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                            placeholder="Enter any allergies (optional)"
                          />
                        </div>
                        
                        <Button onClick={handleAddChild} className="w-full">
                          Add Child
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>View and schedule appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map((appointment) => {
                        const child = children.find(c => (c.child_id || c.id) === appointment.child_id);
                        const doctor = DOCTORS.find(d => d.doctor_id === appointment.doctor_id);

                        return (
                          <div key={appointment.appointment_id || appointment.id} className="p-4 border rounded-lg">
                            <h3 className="font-semibold">
                              {child ? `${child.first_name} ${child.last_name}` : 'Unknown Child'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Date: {new Date(appointment.appointment_date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Time: {appointment.appointment_time}
                            </p>
                            <p className="text-sm text-gray-600">
                              Status: <span className="capitalize">{appointment.status}</span>
                            </p>
                            {appointment.reason && (
                              <p className="text-sm text-gray-600">
                                Reason: {appointment.reason}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              Doctor: Dr. {doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Unknown Doctor'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No appointments scheduled</p>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book Appointment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
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
                              <option key={child.id} value={child.child_id || child.id}>
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
                            {DOCTORS.map((doctor) => (
                              <option key={doctor.doctor_id} value={doctor.doctor_id}>
                                Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
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

                        <Button onClick={handleBookAppointment} className="w-full">
                          Book Appointment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Vaccination Records</CardTitle>
                <CardDescription>Track vaccination history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {children.length > 0 ? (
                    <div className="space-y-4">
                      {children.map((child) => (
                        <div key={child.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{child.first_name} {child.last_name}</h3>
                              <p className="text-sm text-gray-600">
                                Born: {new Date(child.date_of_birth).toLocaleDateString()}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => fetchVaccinationRecords(child.child_id || child.id)}
                            >
                              View Records
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No children added yet</p>
                  )}

                  <Dialog open={isRecordsDialogOpen} onOpenChange={setIsRecordsDialogOpen}>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Vaccination Records</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {vaccinationRecords.length === 0 ? (
                          <p className="text-center text-gray-500">No vaccination records found</p>
                        ) : (
                          <div className="space-y-4">
                            {vaccinationRecords.map((record) => (
                              <div key={record.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold">{record.vaccine_name}</h4>
                                    <p className="text-sm text-gray-600">
                                      Date: {new Date(record.vaccination_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Doctor: Dr. {record.doctor_first_name} {record.doctor_last_name}
                                    </p>
                                    {record.notes && (
                                      <p className="text-sm text-gray-600 mt-2">
                                        Notes: {record.notes}
                                      </p>
                                    )}
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    record.status === 'completed' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {record.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Chatbot />
      <MapButton />
      
      <Footer />
    </div>
  );
};

export default ParentDashboard;
