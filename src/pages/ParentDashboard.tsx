import { useState, useEffect, useRef } from "react";
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
import { Plus, Calendar, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { SummaryCards } from "@/components/patient/SummaryCards";
import { PatientTabs } from "@/components/patient/PatientTabs";
import { Chatbot } from "@/components/patient/Chatbot";
import { MapButton } from "@/components/patient/MapButton";
import { MOCK_CHILDREN, MOCK_APPOINTMENTS, MOCK_VACCINATION_HISTORY } from "@/lib/mockData";
import { VaccineAssistant } from "@/components/VaccineAssistant";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Simple Notifications component
const Notifications = ({ notifications, hasNew, onClearNew }) => {
  return (
    <Dialog onOpenChange={(open) => {
      if (open) onClearNew();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasNew && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500"></span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 border rounded-lg ${
                  notification.type === 'success' ? 'bg-green-50 border-green-200' :
                  notification.type === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        {notification.type === 'success' ? 'Success' : 
                         notification.type === 'error' ? 'Alert' : 
                         'Information'}
                      </div>
                      <div className="text-sm">{notification.message}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(notification.time).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Add this constant at the top of your file, outside the component
const DOCTORS = [
  { doctor_id: "1", first_name: 'Arun', last_name: 'Patel', specialization: 'Pediatrician' },
  { doctor_id: "2", first_name: 'Priya', last_name: 'Sharma', specialization: 'Vaccination Specialist' },
  { doctor_id: "3", first_name: 'Rajesh', last_name: 'Kumar', specialization: 'Child Specialist' },
  { doctor_id: "4", first_name: 'Deepa', last_name: 'Gupta', specialization: 'Pediatrician' },
  { doctor_id: "5", first_name: 'Suresh', last_name: 'Verma', specialization: 'Immunologist' },
  { doctor_id: "6", first_name: 'Anita', last_name: 'Singh', specialization: 'Pediatrician' },
  { doctor_id: "7", first_name: 'Vikram', last_name: 'Malhotra', specialization: 'Child Specialist' }
];

// Add this constant at the top of your file, outside the component
const VACCINES = [
  { id: 1, name: 'DTaP (Diphtheria, Tetanus, Pertussis)', recommended_age: '2 months, 4 months, 6 months, 15-18 months, 4-6 years' },
  { id: 2, name: 'IPV (Polio)', recommended_age: '2 months, 4 months, 6-18 months, 4-6 years' },
  { id: 3, name: 'MMR (Measles, Mumps, Rubella)', recommended_age: '12-15 months, 4-6 years' },
  { id: 4, name: 'Varicella (Chickenpox)', recommended_age: '12-15 months, 4-6 years' },
  { id: 5, name: 'Hepatitis B', recommended_age: 'Birth, 1-2 months, 6-18 months' },
  { id: 6, name: 'Hepatitis A', recommended_age: '12-23 months' },
  { id: 7, name: 'Hib (Haemophilus influenzae type b)', recommended_age: '2 months, 4 months, 6 months, 12-15 months' },
  { id: 8, name: 'PCV13 (Pneumococcal)', recommended_age: '2 months, 4 months, 6 months, 12-15 months' },
  { id: 9, name: 'RV (Rotavirus)', recommended_age: '2 months, 4 months, 6 months' },
  { id: 10, name: 'Influenza (Flu)', recommended_age: 'Annually, starting at 6 months' }
];

const AppointmentFormSchema = z.object({
  child_id: z.string().min(1, { message: "Please select a child" }),
  doctor_id: z.string().min(1, { message: "Please select a doctor" }),
  date: z.date(),
  reason: z.string().optional(),
  vaccine: z.string().optional()
});

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
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [currentParent, setCurrentParent] = useState(null);
  const [notifiedAppointments] = useState(new Set());
  const [doctors, setDoctors] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const appointmentDialog = useRef(null);
  const bookAppointmentDialogRef = useRef(null);

  // Move form definition to the top level to avoid conditional hook calls
  const form = useForm({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      child_id: "",
      doctor_id: "",
      date: new Date(),
      reason: "",
      vaccine: ""
    }
  });

  console.log("User data:", user);

  // Enhanced function to check for appointment updates
  const checkForUpdates = () => {
    try {
      console.log("🔍 Checking for appointment updates...");
      
      // Load user from local storage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Load and update children first to ensure we have the latest data
      try {
        const storedChildrenJson = localStorage.getItem('children');
        if (storedChildrenJson) {
          const allChildren = JSON.parse(storedChildrenJson);
          // Filter children for current parent
          const userChildren = allChildren.filter(child => 
            String(child.parent_id) === String(currentUser.id)
          );
          console.log(`👨‍👩‍👧‍👦 Found ${userChildren.length} children for parent ${currentUser.id}`);
          setChildren(userChildren);
        }
      } catch (childError) {
        console.error("❌ Error loading children during update:", childError);
      }
      
      // Now check appointments
      const storedAppointmentsJson = localStorage.getItem('appointments');
      if (!storedAppointmentsJson) return;

      const allAppointments = JSON.parse(storedAppointmentsJson);
      
      // Filter appointments that belong to the current user
      const userAppointments = allAppointments.filter(apt => {
        // Make sure to compare strings for parent_id
        const aptParentId = String(apt.parent_id);
        const currentUserId = String(currentUser.id);
        
        const isMatch = aptParentId === currentUserId;
        if (isMatch) {
          console.log(`👨‍👩‍👧‍👦 Found appointment for current user: ${apt.child_name || 'Unknown Child'}, Status: ${apt.status}`);
        }
        return isMatch;
      });
      
      console.log(`📊 Found ${userAppointments.length} appointments for parent ${currentUser.id}`);
      
      // Update state with the filtered appointments
      setAppointments(userAppointments);
      
      // Check for status changes that require notifications
      userAppointments.forEach(appointment => {
        const appointmentId = appointment.id || appointment.appointment_id;
        
        // Skip if we've already notified about this status
        if (notifiedAppointments.has(`${appointmentId}-${appointment.status}`)) {
          return;
        }
        
        // Create a notification based on status
        if (appointment.status === 'confirmed') {
          console.log(`🔔 Notifying about confirmed appointment ${appointmentId}`);
          toast({
            title: "Appointment Confirmed",
            description: `Your appointment for ${appointment.child_name || 'your child'} on ${new Date(appointment.appointment_date).toLocaleDateString()} has been confirmed by the doctor.`,
          });
          
          // Play notification sound
          try {
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(e => console.log('🔇 Audio play failed:', e));
          } catch (error) {
            console.log('🔇 Sound notification failed:', error);
          }
          
          // Mark as notified
          notifiedAppointments.add(`${appointmentId}-confirmed`);
        } 
        else if (appointment.status === 'rejected') {
          console.log(`🔔 Notifying about rejected appointment ${appointmentId}`);
          toast({
            variant: "destructive",
            title: "Appointment Rejected",
            description: `Your appointment for ${appointment.child_name || 'your child'} on ${new Date(appointment.appointment_date).toLocaleDateString()} has been rejected by the doctor.`,
          });
          
          // Play notification sound
          try {
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(e => console.log('🔇 Audio play failed:', e));
          } catch (error) {
            console.log('🔇 Sound notification failed:', error);
          }
          
          // Mark as notified
          notifiedAppointments.add(`${appointmentId}-rejected`);
        }
        else if (appointment.status === 'completed') {
          console.log(`🔔 Notifying about completed appointment ${appointmentId}`);
          toast({
            title: "Appointment Completed",
            description: `Your appointment for ${appointment.child_name || 'your child'} on ${new Date(appointment.appointment_date).toLocaleDateString()} has been marked as completed.`,
          });
          
          // Play notification sound
          try {
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(e => console.log('🔇 Audio play failed:', e));
          } catch (error) {
            console.log('🔇 Sound notification failed:', error);
          }
          
          // Mark as notified
          notifiedAppointments.add(`${appointmentId}-completed`);
        }
      });
    } catch (error) {
      console.error("❌ Error checking for updates:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentParent(user);
        
        // Load children from localStorage
        try {
          const storedChildrenJson = localStorage.getItem('children');
          if (storedChildrenJson) {
            const allChildren = JSON.parse(storedChildrenJson);
            console.log("👶 All children:", allChildren);
            
            // Filter children for current parent
            const userChildren = allChildren.filter(child => String(child.parent_id) === String(user.id));
            console.log(`👨‍👩‍👧‍👦 Found ${userChildren.length} children for parent ${user.id}`);
            setChildren(userChildren);

            // Move vaccinations loading here to ensure children are loaded first
            try {
              const storedVaccinationsJson = localStorage.getItem('vaccinations');
              if (storedVaccinationsJson) {
                const allVaccinations = JSON.parse(storedVaccinationsJson);
                console.log("💉 All vaccinations:", allVaccinations);
                
                // Filter vaccinations for current parent's children
                const userChildrenIds = userChildren.map(child => String(child.id || child.child_id));
                const userVaccinations = allVaccinations.filter(vac => 
                  userChildrenIds.includes(String(vac.child_id))
                );
                
                console.log(`💉 Found ${userVaccinations.length} vaccinations for parent's children`);
                setVaccinations(userVaccinations);
              }
            } catch (error) {
              console.error("❌ Error loading vaccinations:", error);
            }
          }
        } catch (error) {
          console.error("❌ Error loading children:", error);
        }
        
        // Load doctors from localStorage or API
        try {
          let doctorsData = [];
          const storedDoctorsJson = localStorage.getItem('doctors');
          
          if (storedDoctorsJson) {
            doctorsData = JSON.parse(storedDoctorsJson);
          } else {
            // Try to get from DOCTOR_CREDENTIALS in Login.tsx format
            const doctorCredentials = {
              "doctor1@example.com": { id: "1", name: "Dr. Sarah Johnson", specialization: "Pediatrician" },
              "doctor2@example.com": { id: "2", name: "Dr. James Wilson", specialization: "Family Medicine" },
              "doctor3@example.com": { id: "3", name: "Dr. Emma Thompson", specialization: "Pediatric Immunology" },
              "doctor4@example.com": { id: "4", name: "Dr. Michael Chen", specialization: "General Practitioner" },
              "doctor5@example.com": { id: "5", name: "Dr. Lisa Rodriguez", specialization: "Pediatric Care" },
              "doctor6@example.com": { id: "6", name: "Dr. Robert Lee", specialization: "Family Health" },
              "doctor7@example.com": { id: "7", name: "Dr. Emily Davis", specialization: "Child Immunology" }
            };
            
            doctorsData = Object.values(doctorCredentials).map(doc => ({
              id: doc.id,
              doctor_id: doc.id,
              firstName: doc.name.split(' ')[1],
              lastName: doc.name.split(' ')[2] || '',
              specialization: doc.specialization,
              name: doc.name
            }));
            
            localStorage.setItem('doctors', JSON.stringify(doctorsData));
          }
          
          console.log(`👨‍⚕️ Found ${doctorsData.length} doctors`);
          setDoctors(doctorsData);
        } catch (error) {
          console.error("❌ Error loading doctors:", error);
        }
        
        // Check for appointment updates immediately
        checkForUpdates();
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch required data"
        });
      }
    };

    fetchData();
    
    // Check for updates regularly (every 5 seconds)
    const intervalId = setInterval(checkForUpdates, 5000);
    return () => clearInterval(intervalId);
  }, [toast, notifiedAppointments]);

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

      // Create child data object
      const childData = {
        id: `ch_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        child_id: `ch_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        parent_id: parentId, // Explicitly include parent_id
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        gender: gender.toLowerCase(),
        blood_group: bloodGroup || null,
        allergies: allergies || null,
        created_at: new Date().toISOString()
      };

      console.log("New child data:", childData); // Debug log

      // Save to localStorage directly
      try {
        const storedChildrenJson = localStorage.getItem('children');
        const storedChildren = storedChildrenJson ? JSON.parse(storedChildrenJson) : [];
        
        // Add the new child
        storedChildren.push(childData);
        
        // Save back to localStorage
        localStorage.setItem('children', JSON.stringify(storedChildren));
        console.log("Child saved to localStorage");
        
        // Update the children state
        setChildren([...children, childData]);
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError);
      }

      // Try to also send to the backend API
      try {
        const response = await fetch("http://localhost:5000/api/children", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(childData)
        });

        if (!response.ok) {
          console.log("API request failed, but child was saved to localStorage");
        } else {
          const data = await response.json();
          console.log("Response data from API:", data);
        }
      } catch (apiError) {
        console.error("API error (continuing with localStorage only):", apiError);
      }
      
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

  const handleBookAppointment = async (data: z.infer<typeof AppointmentFormSchema>) => {
    try {
      // Add detailed debug logs for appointment creation
      console.log("📝 Creating appointment with data:", data);
      
      // Validation 
      if (!data.child_id) {
        console.error("❌ Missing child_id in form data");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Child information is required"
        });
        return;
      }
      
      if (!data.doctor_id) {
        console.error("❌ Missing doctor_id in form data");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Doctor information is required"
        });
        return;
      }
      
      if (!data.date) {
        console.error("❌ Missing date in form data");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Appointment date is required"
        });
        return;
      }
      
      // Parse IDs and ensure they are valid
      const childId = String(data.child_id);
      const doctorId = String(data.doctor_id);
      
      console.log(`🧩 Using child_id: ${childId}, doctor_id: ${doctorId}`);
      console.log(`🧩 doctor_id type: ${typeof doctorId}, value: ${doctorId}`);
      
      // Get the child information
      const child = children.find(c => String(c.id) === childId);
      if (!child) {
        console.error(`❌ Child with ID ${childId} not found`);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Selected child not found"
        });
        return;
      }
      
      // Get the doctor information
      const doctor = doctors.find(d => String(d.id) === doctorId || String(d.doctor_id) === doctorId);
      if (!doctor) {
        // Try to find in the DOCTORS constant if not found in the state
        const constDoctor = DOCTORS.find(d => String(d.doctor_id) === doctorId);
        if (!constDoctor) {
          console.error(`❌ Doctor with ID ${doctorId} not found`);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Selected doctor not found"
          });
          return;
        }
      }
      
      // Get the parent information
      const parent = JSON.parse(localStorage.getItem('user') || '{}');
      if (!parent || !parent.id) {
        console.error("❌ Parent information not found in localStorage");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Parent information not found. Please log in again."
        });
        return;
      }
      
      // Create a unique ID for the appointment
      const appointmentId = `app_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      console.log(`🆔 Generated appointment ID: ${appointmentId}`);
      
      // Create the appointment data
      const appointmentData = {
        id: appointmentId,
        appointment_id: appointmentId,
        parent_id: String(parent.id),
        child_id: childId,
        doctor_id: doctorId, // Explicitly using the string version
        child_name: `${child.first_name} ${child.last_name}`,
        child_dob: child.date_of_birth,
        child_gender: child.gender,
        appointment_date: data.date.toISOString(),
        reason: data.reason || "General checkup",
        vaccine: data.vaccine || null,
        status: "pending",
        created_at: new Date().toISOString()
      };
      
      console.log("📋 Final appointment data:", appointmentData);
      console.log(`📋 Doctor ID type: ${typeof appointmentData.doctor_id}, value: ${appointmentData.doctor_id}`);
      
      // Save the appointment to localStorage
      try {
        const storedAppointmentsJson = localStorage.getItem('appointments');
        const allAppointments = storedAppointmentsJson ? JSON.parse(storedAppointmentsJson) : [];
        
        // Add the new appointment
        allAppointments.push(appointmentData);
        
        // Save back to localStorage
        localStorage.setItem('appointments', JSON.stringify(allAppointments));
        console.log("💾 Saved appointment to localStorage");
        console.log("💾 All appointments after save:", allAppointments);
      } catch (error) {
        console.error("❌ Error saving appointment to localStorage:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save appointment data"
        });
        return;
      }
      
      // Create a corresponding vaccination record for tracking
      if (data.vaccine) {
        console.log(`💉 Creating vaccination record for: ${data.vaccine}`);
        
        const vaccinationId = `vac_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        const vaccinationData = {
          id: vaccinationId,
          vaccination_id: vaccinationId,
          child_id: childId,
          appointment_id: appointmentId,
          vaccine_name: data.vaccine,
          vaccine_date: null, // Will be updated when the appointment is completed
          status: "scheduled", // Will be updated when the appointment is completed
          created_at: new Date().toISOString()
        };
        
        // Save the vaccination record to localStorage
        try {
          const storedVaccinationsJson = localStorage.getItem('vaccinations');
          const allVaccinations = storedVaccinationsJson ? JSON.parse(storedVaccinationsJson) : [];
          
          // Add the new vaccination
          allVaccinations.push(vaccinationData);
          
          // Save back to localStorage
          localStorage.setItem('vaccinations', JSON.stringify(allVaccinations));
          console.log("💾 Saved vaccination record to localStorage");
        } catch (error) {
          console.error("❌ Error saving vaccination record to localStorage:", error);
          // Don't return, as the appointment was already saved
        }
      }
      
      // Try to send the data to the backend API
      try {
        const response = await fetch('http://localhost:5000/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(appointmentData)
        });
        
        if (!response.ok) {
          console.error('⚠️ Backend API returned error, but appointment was saved locally');
        }
      } catch (error) {
        console.error("⚠️ Backend API error, but appointment was saved locally:", error);
      }
      
      // Show success toast
      toast({
        title: "Appointment Booked",
        description: `Appointment for ${child.first_name} has been scheduled.`,
      });
      
      // Refresh the appointments list
      checkForUpdates();
      
      // Update the UI
      bookAppointmentDialogRef.current?.openChange(false);
      form.reset({
        child_id: "",
        doctor_id: "",
        date: new Date(),
        reason: "",
        vaccine: ""
      });
    } catch (error) {
      console.error("❌ Error booking appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to book appointment"
      });
    }
  };

  const fetchVaccinationRecords = async (childId) => {
    try {
      // First try to get from backend
      let records = [];
      
      try {
        const response = await fetch(`http://localhost:5000/api/children/${childId}/vaccination-records`, {
          headers: { "Content-Type": "application/json" },
        });
        
        if (response.ok) {
          records = await response.json();
        }
      } catch (error) {
        console.log("Backend fetch error, using localStorage:", error);
      }
      
      // If no records from backend, try localStorage
      if (records.length === 0) {
        const recordsJson = localStorage.getItem('vaccination_records');
        if (recordsJson) {
          const allRecords = JSON.parse(recordsJson);
          records = allRecords.filter(r => r.child_id.toString() === childId.toString());
        }
      }
      
      console.log("Fetched vaccination records:", records);
      setVaccinationRecords(records);
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
            <div className="mt-4 md:mt-0">
              <Notifications 
                notifications={notifications}
                hasNew={hasNewNotification}
                onClearNew={() => setHasNewNotification(false)}
              />
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
                        // Improve child lookup logic with fallbacks
                        const child = children.find(c => 
                          String(c.child_id || c.id) === String(appointment.child_id)
                        ) || { 
                          first_name: appointment.child_name?.split(' ')[0] || 'Unknown', 
                          last_name: appointment.child_name?.split(' ')[1] || 'Child' 
                        };
                        
                        // Improve doctor lookup with IDs as strings and fallbacks to our data
                        const doctorId = String(appointment.doctor_id);
                        const doctorFromState = doctors.find(d => String(d.id || d.doctor_id) === doctorId);
                        const doctorFromConstants = DOCTORS.find(d => String(d.doctor_id) === doctorId);
                        const doctor = doctorFromState || doctorFromConstants;

                        return (
                          <div key={appointment.appointment_id || appointment.id} className="p-4 border rounded-lg">
                            <h3 className="font-semibold">
                              {child ? `${child.first_name} ${child.last_name}` : (appointment.child_name || 'Unknown Child')}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Date: {new Date(appointment.appointment_date).toLocaleDateString()}
                            </p>
                            {appointment.appointment_time && (
                              <p className="text-sm text-gray-600">
                                Time: {appointment.appointment_time}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              Status: <span className="capitalize">{appointment.status}</span>
                            </p>
                            {appointment.reason && (
                              <p className="text-sm text-gray-600">
                                Reason: {appointment.reason}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              Doctor: {doctor 
                                ? (doctor.name || `Dr. ${doctor.first_name || doctor.firstName} ${doctor.last_name || doctor.lastName}`)
                                : 'Unknown Doctor'
                              }
                            </p>
                            {appointment.vaccine && (
                              <p className="text-sm text-gray-600">
                                Vaccine: {appointment.vaccine}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No appointments scheduled</p>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => {
                        // Reset form when opening dialog
                        form.reset({
                          child_id: "",
                          doctor_id: "",
                          date: new Date(),
                          reason: "",
                          vaccine: ""
                        });
                      }}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Book Appointment</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit((data) => {
                          handleBookAppointment(data);
                          
                          // Close dialog after submission
                          const dialogCloser = document.querySelector('[data-state="open"] button[data-state]');
                          if (dialogCloser) {
                            (dialogCloser as HTMLButtonElement).click();
                          }
                        })();
                      }}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="child_id">Select Child *</Label>
                            <select 
                              id="child_id" 
                              className="w-full border rounded-md p-2"
                              {...form.register("child_id", { required: true })}
                            >
                              <option value="">Select a child</option>
                              {children.map((child) => (
                                <option key={child.id || child.child_id} value={child.id || child.child_id}>
                                  {child.first_name} {child.last_name}
                                </option>
                              ))}
                            </select>
                            {form.formState.errors.child_id && (
                              <p className="text-xs text-red-500 mt-1">Please select a child</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="doctor_id">Select Doctor *</Label>
                            <select 
                              id="doctor_id" 
                              className="w-full border rounded-md p-2"
                              {...form.register("doctor_id", { required: true })}
                            >
                              <option value="">Select a doctor</option>
                              {/* First try to use the doctors from state */}
                              {doctors.length > 0 ? (
                                doctors.map((doctor) => (
                                  <option key={doctor.id || doctor.doctor_id} value={doctor.id || doctor.doctor_id}>
                                    {doctor.name || `Dr. ${doctor.firstName} ${doctor.lastName}`} - {doctor.specialization}
                                  </option>
                                ))
                              ) : (
                                // Fall back to the constant DOCTORS if needed
                                DOCTORS.map((doctor) => (
                                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                                    Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                                  </option>
                                ))
                              )}
                            </select>
                            {form.formState.errors.doctor_id && (
                              <p className="text-xs text-red-500 mt-1">Please select a doctor</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="vaccine">Select Vaccine *</Label>
                            <select 
                              id="vaccine" 
                              className="w-full border rounded-md p-2"
                              {...form.register("vaccine")}
                            >
                              <option value="">Select a vaccine</option>
                              {VACCINES.map((vaccine) => (
                                <option key={vaccine.id} value={vaccine.name}>
                                  {vaccine.name} - {vaccine.recommended_age}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <input
                              id="date"
                              type="date"
                              className="w-full border rounded-md p-2"
                              min={new Date().toISOString().split('T')[0]}
                              required
                              onChange={(e) => {
                                // Convert the string date to a Date object
                                const dateValue = e.target.value ? new Date(e.target.value) : null;
                                form.setValue("date", dateValue);
                              }}
                            />
                            {form.formState.errors.date && (
                              <p className="text-xs text-red-500 mt-1">Please select a date</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="reason">Reason *</Label>
                            <Input 
                              id="reason" 
                              placeholder="Enter the reason for the appointment"
                              {...form.register("reason")}
                            />
                          </div>

                          <Button type="submit" className="w-full">
                            Book Appointment
                          </Button>
                        </div>
                      </form>
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
      
      {/* <Chatbot /> */}
      <MapButton />
      
      <Footer />
      
      <VaccineAssistant />
    </div>
  );
};

export default ParentDashboard;
