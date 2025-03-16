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
import { MOCK_CHILDREN, MOCK_APPOINTMENTS, MOCK_VACCINATION_HISTORY } from "@/lib/mockData";
import { children as childrenApi, appointments as appointmentsApi, vaccinationRecords as vaccinationRecordsApi, doctors as doctorsApi } from "@/services/api";

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
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState("children");

  console.log("User data:", user);

  // Function to fetch children
  const fetchChildren = async () => {
    try {
      // Make sure we have a user before making the request
      if (!user) {
        console.log("No user available");
        return;
      }

      const response = await childrenApi.getAll();
      setChildren(response.data || []);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch children data"
      });
    }
  };

  // Function to fetch appointments
  const fetchAppointments = async () => {
    try {
      // Make sure we have a user before making the request
      if (!user) {
        console.log("No user available");
        return;
      }

      const response = await appointmentsApi.getAll();
      console.log("Fetched appointments:", response.data); // Debug log
      setAppointments(response.data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch appointments data"
      });
    }
  };

  // Function to fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await doctorsApi.getAll();
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch doctors"
      });
    }
  };

  // Function to fetch vaccination records
  const fetchVaccinationRecords = async () => {
    try {
      const response = await vaccinationRecordsApi.getAll();
      console.log("Fetched vaccination records:", response.data);
      setVaccinationRecords(response.data || []);
    } catch (error) {
      console.error("Error fetching vaccination records:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch vaccination records"
      });
    }
  };

  const fetchVaccinationRecordsForChild = async (childId) => {
    try {
      if (!childId) {
        console.log("No child ID provided");
        return;
      }

      const response = await vaccinationRecordsApi.getByChild(childId);
      console.log("Vaccination records for child:", response.data);
      setVaccinationRecords(response.data);
      setIsRecordsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching vaccination records:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch vaccination records"
      });
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    if (user && role === "parent") {
      fetchChildren();
      fetchAppointments();
      fetchDoctors();
      fetchVaccinationRecords();
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

      const childData = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        gender: gender.toLowerCase(),
        blood_group: bloodGroup || null,
        allergies: allergies || null
      };

      console.log("Sending child data:", childData); // Debug log

      const response = await childrenApi.create(childData);
      console.log("Response data:", response.data); // Debug log
      
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

      // Refresh appointments
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

  // Map appointments data for PatientTabs component
  const mappedAppointments = appointments.map(appointment => {
    const child = children.find(c => (c.child_id || c.id) === appointment.child_id);
    const doctor = doctors.find(d => d.id === appointment.doctor_id) || 
                  DOCTORS.find(d => d.doctor_id === appointment.doctor_id);
    
    return {
      id: appointment.appointment_id || appointment.id,
      childName: child ? `${child.first_name} ${child.last_name}` : 'Unknown Child',
      vaccineName: appointment.vaccine_name || 'General Checkup',
      doctorName: doctor ? `Dr. ${doctor.firstName || doctor.first_name} ${doctor.lastName || doctor.last_name}` : 'Dr. Unknown Doctor',
      date: appointment.appointment_date || appointment.date,
      time: appointment.appointment_time || appointment.time,
      status: appointment.status
    };
  });

  // Map vaccination records data for PatientTabs component
  const mappedVaccinationHistory = vaccinationRecords.map(record => {
    const child = children.find(c => c.id === record.child_id);
    
    // Debug logs to help identify issues
    console.log("Mapping vaccination record:", record);
    console.log("Found child for record:", child);
    
    return {
      id: record.id,
      child_name: child ? `${child.first_name} ${child.last_name}` : 'Unknown Child',
      vaccine_name: record.vaccine_name || 'Unknown Vaccine',
      vaccination_date: record.vaccination_date,
      status: record.status || 'completed',
      child_id: record.child_id,
      doctor_name: record.doctor_first_name && record.doctor_last_name 
        ? `Dr. ${record.doctor_first_name} ${record.doctor_last_name}` 
        : 'Unknown Doctor',
      notes: record.notes || ''
    };
  });

  // Map children data for PatientTabs component
  const mappedChildren = children.map(child => {
    const childRecords = vaccinationRecords.filter(record => 
      (record.child_id === child.id || record.child_id === child.child_id) && 
      record.status === 'completed'
    );
    
    const childAppointments = appointments.filter(app => 
      (app.child_id === child.id || app.child_id === child.child_id) && 
      (app.status === 'pending' || app.status === 'confirmed')
    );
    
    return {
      id: child.id || child.child_id,
      name: `${child.first_name} ${child.last_name}`,
      dateOfBirth: child.date_of_birth,
      gender: child.gender,
      completedVaccines: childRecords.length,
      upcomingVaccines: childAppointments.length
    };
  });

  // Handle scheduling a vaccine for a specific child
  const handleScheduleVaccine = (childId: string) => {
    // Switch to appointments tab
    setActiveTab("appointments");
    
    // Set a small timeout to ensure the tab has changed before showing the toast
    setTimeout(() => {
      toast({
        title: "Schedule Vaccine",
        description: "Please use the Book Appointment button to schedule a vaccine.",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Parent Dashboard</h1>
        
        <SummaryCards 
          childrenCount={children.length} 
          upcomingAppointmentsCount={appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length}
          completedVaccinationsCount={vaccinationRecords.filter(r => r.status === 'completed').length}
        />
        
        <div className="mt-8">
          <PatientTabs 
            children={mappedChildren}
            appointments={mappedAppointments}
            vaccinationHistory={mappedVaccinationHistory}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onChildAdded={fetchChildren}
            onAppointmentBooked={fetchAppointments}
            onScheduleVaccine={handleScheduleVaccine}
            onRefreshVaccinationHistory={fetchVaccinationRecords}
          />
        </div>
      </main>
      
      <Chatbot />
      
      <Footer />
    </div>
  );
};

export default ParentDashboard;
