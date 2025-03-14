import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
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

// Doctor credentials map (for authorization)
const DOCTOR_CREDENTIALS = {
  'doctor1@example.com': { id: "1", firstName: 'Arun', lastName: 'Patel', specialization: 'Pediatrician' },
  'doctor2@example.com': { id: "2", firstName: 'Priya', lastName: 'Sharma', specialization: 'Vaccination Specialist' },
  'doctor3@example.com': { id: "3", firstName: 'Rajesh', lastName: 'Kumar', specialization: 'Child Specialist' },
  'doctor4@example.com': { id: "4", firstName: 'Deepa', lastName: 'Gupta', specialization: 'Pediatrician' },
  'doctor5@example.com': { id: "5", firstName: 'Suresh', lastName: 'Verma', specialization: 'Immunologist' },
  'doctor6@example.com': { id: "6", firstName: 'Anita', lastName: 'Singh', specialization: 'Pediatrician' },
  'doctor7@example.com': { id: "7", firstName: 'Vikram', lastName: 'Malhotra', specialization: 'Child Specialist' },
};

const DoctorDashboard = () => {
  // Get the existing auth context (even though it's not working correctly)
  const { user, role, loading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  // State variables for the dashboard
  const [appointments, setAppointments] = useState([]);
  const [children, setChildren] = useState([]);
  const [parents, setParents] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  
  // Function to fetch appointments from localStorage
  const fetchAppointmentsFromStorage = () => {
    try {
      const storedAppointmentsJson = localStorage.getItem('appointments');
      if (!storedAppointmentsJson) {
        console.log("⚠️ No appointments found in localStorage");
        return [];
      }
      
      const allAppointments = JSON.parse(storedAppointmentsJson);
      console.log("📋 All appointments in localStorage:", allAppointments);
      console.log("👨‍⚕️ Current doctor ID:", currentDoctor?.id);
      console.log("👨‍⚕️ Current doctor ID type:", typeof currentDoctor?.id);
      
      // Debug: Log all doctor_ids from appointments to help diagnose issues
      console.log("🔍 All appointment doctor_ids:", allAppointments.map(apt => ({
        id: apt.id || apt.appointment_id,
        doctor_id: apt.doctor_id,
        doctor_id_type: typeof apt.doctor_id,
        status: apt.status
      })));
      
      // Improved filtering with better type handling
      const filteredAppointments = allAppointments.filter(apt => {
        // Make sure we compare strings
        const aptDoctorId = String(apt.doctor_id);
        const currentDoctorId = String(currentDoctor?.id);
        
        const isMatch = aptDoctorId === currentDoctorId;
        console.log(`🔍 Appointment ${apt.id || apt.appointment_id}: Doctor=${aptDoctorId} (${typeof apt.doctor_id}), Current=${currentDoctorId} (${typeof currentDoctor?.id}), Match=${isMatch}`);
        if (isMatch) {
          console.log(`📅 Matched appointment details: ${apt.child_name || 'Unknown Child'}, Date: ${apt.appointment_date}, Status: ${apt.status}`);
        }
        return isMatch;
      });
      
      console.log(`📊 Found ${filteredAppointments.length} appointments for doctor ${currentDoctor?.id}`);
      if (filteredAppointments.length === 0) {
        console.log("⚠️ No appointments found for this doctor. Double-check IDs.");
      }
      return filteredAppointments;
    } catch (error) {
      console.error("❌ Error loading appointments from localStorage:", error);
      return [];
    }
  };
  
  // Get email from localStorage or state
  const getUserFromLocalStorage = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };
  
  // Get the email from localStorage or location state
  const storedUser = getUserFromLocalStorage();
  const emailFromState = location.state?.email || '';
  const email = storedUser?.email || emailFromState;
  
  console.log("Email:", email);
  console.log("StoredUser:", storedUser);
  
  // Check if the email belongs to a doctor
  const isDoctorEmail = email && email in DOCTOR_CREDENTIALS;
  const currentDoctor = isDoctorEmail ? { 
    ...DOCTOR_CREDENTIALS[email],
    // Ensure ID is a string for consistency
    id: String(DOCTOR_CREDENTIALS[email].id)
  } : null;
  
  // Debug logs
  console.log("User:", user);
  console.log("Role:", role);
  console.log("Email:", email);
  console.log("Is Doctor Email:", isDoctorEmail);
  console.log("Current Doctor:", currentDoctor);

  useEffect(() => {
    const fetchData = async () => {
      if (currentDoctor) {
        try {
          // Load appointments from localStorage first
          let appointmentsData = fetchAppointmentsFromStorage();
          console.log("✅ Initial appointments from localStorage:", appointmentsData);
          
          // Try API as secondary source
          try {
            const appointmentsResponse = await fetch(`http://localhost:5000/api/appointments`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (appointmentsResponse.ok) {
              const apiAppointments = await appointmentsResponse.json();
              console.log("🌐 Appointments from API:", apiAppointments);
              
              // If we got API data, merge with localStorage data
              if (apiAppointments && apiAppointments.length > 0) {
                // Use a Map to combine by ID and avoid duplicates
                const appointmentMap = new Map();
                [...appointmentsData, ...apiAppointments].forEach(apt => {
                  const id = apt.id || apt.appointment_id;
                  appointmentMap.set(id, apt);
                });
                appointmentsData = Array.from(appointmentMap.values());
              }
            }
          } catch (error) {
            console.log("⚠️ API fetch failed, using localStorage only:", error);
          }
          
          if (appointmentsData.length === 0) {
            console.log("ℹ️ No appointments found for doctor ID:", currentDoctor.id);
            
            // Show a toast notification to let the user know
            toast({
              title: "No Appointments Found",
              description: "You don't have any appointments scheduled yet. Wait for parents to book appointments with you.",
            });
          } else {
            console.log(`✅ Found ${appointmentsData.length} appointments for Doctor ${currentDoctor.firstName} ${currentDoctor.lastName}`);
          }
          
          setAppointments(appointmentsData);

          // Similar approach for children data
          let childrenData = [];
          try {
            const childrenResponse = await fetch(`http://localhost:5000/api/children`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (childrenResponse.ok) {
              childrenData = await childrenResponse.json();
            }
          } catch (error) {
            console.log("⚠️ Children API fetch failed, using localStorage data:", error);
            
            // Try to get children from localStorage
            const storedChildrenJson = localStorage.getItem('children');
            if (storedChildrenJson) {
              try {
                childrenData = JSON.parse(storedChildrenJson);
              } catch (parseError) {
                console.error("❌ Error parsing children from localStorage:", parseError);
              }
            }
          }
          
          // If no children found, but there are appointments, extract child info from appointments
          if ((childrenData.length === 0) && appointmentsData.length > 0) {
            console.log("🔄 Extracting child data from appointments");
            
            const childrenFromAppointments = appointmentsData
              .filter(apt => apt.child_id)
              .map(apt => {
                return {
                  id: apt.child_id,
                  child_id: apt.child_id,
                  first_name: apt.child_name ? apt.child_name.split(' ')[0] : 'Child',
                  last_name: apt.child_name ? apt.child_name.split(' ')[1] || '' : `#${apt.child_id}`,
                  date_of_birth: apt.child_dob || new Date().toISOString().split('T')[0],
                  gender: apt.child_gender || 'unknown'
                };
              });
              
            // Remove duplicates by child_id
            const uniqueChildren = {};
            childrenFromAppointments.forEach(child => {
              const childId = child.id || child.child_id;
              if (childId && !uniqueChildren[childId]) {
                uniqueChildren[childId] = child;
              }
            });
            
            childrenData = Object.values(uniqueChildren);
          }
          
          setChildren(childrenData);
          console.log(`👶 Found ${childrenData.length} children from appointments`);
          
          // Count unique parents from appointments
          const uniqueParentIds = new Set();
          appointmentsData.forEach(apt => {
            if (apt.parent_id) {
              uniqueParentIds.add(apt.parent_id);
            }
          });
          
          // Set parents count based on unique parent IDs
          setParents(Array.from(uniqueParentIds).map(id => ({ id })));
        } catch (error) {
          console.error("❌ Error fetching data:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch required data"
          });
        }
      }
    };

    fetchData();
    
    // Add periodic refresh for appointments (every 5 seconds)
    const intervalId = setInterval(() => {
      if (currentDoctor) {
        console.log("⌛ Checking for new appointments...");
        const newAppointments = fetchAppointmentsFromStorage();
        if (JSON.stringify(newAppointments) !== JSON.stringify(appointments)) {
          console.log("🔄 Appointments updated, refreshing data");
          setAppointments(newAppointments);
        }
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [currentDoctor, toast]);

  // If loading, show nothing
  if (loading) return null;

  // Redirect if not a doctor email
  if (!isDoctorEmail) {
    return <Navigate to="/login" />;
  }

  // Helper function to get child's full name with better error handling
  const getChildName = (childId) => {
    if (!childId) return 'Unknown Child';
    
    const child = children.find(c => 
      String(c.child_id) === String(childId) || 
      String(c.id) === String(childId)
    );
    
    if (child) {
      return `${child.first_name} ${child.last_name}`;
    }
    
    // If child not found in our data, try to get from appointment
    const appointment = appointments.find(a => 
      String(a.child_id) === String(childId) && 
      a.child_name
    );
    
    if (appointment) {
      return appointment.child_name;
    }
    
    return 'Unknown Child';
  };

  // Helper function to calculate child's age
  const getChildAge = (childId) => {
    const child = children.find(c => c.child_id === childId || c.id === childId);
    if (!child || !child.date_of_birth) return 'Unknown';
    
    const birthDate = new Date(child.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 1) {
      const months = today.getMonth() - birthDate.getMonth() + 
        (today.getFullYear() - birthDate.getFullYear()) * 12;
      return `${months} months`;
    }
    
    return `${age} years`;
  };

  const handleAcceptAppointment = async (appointment) => {
    try {
      console.log("✅ Accepting appointment:", appointment);
      
      // Update local state optimistically first
      setAppointments(appointments.map(apt => 
        (apt.appointment_id || apt.id) === (appointment.appointment_id || appointment.id) 
          ? { ...apt, status: 'confirmed' } 
          : apt
      ));

      // Update localStorage with better error handling and logging
      const storedAppointmentsJson = localStorage.getItem('appointments');
      if (storedAppointmentsJson) {
        const allAppointments = JSON.parse(storedAppointmentsJson);
        console.log("📋 All appointments before update:", allAppointments.length);
        
        const appointmentId = appointment.appointment_id || appointment.id;
        console.log(`🔍 Updating appointment ${appointmentId} to status: confirmed`);
        
        // Log the parent ID for this appointment
        const parentId = appointment.parent_id;
        console.log(`👨‍👩‍👧‍👦 Parent ID for this appointment: ${parentId}`);
        
        const updatedAppointments = allAppointments.map(apt => {
          const currentId = apt.appointment_id || apt.id;
          if (String(currentId) === String(appointmentId)) {
            console.log(`✏️ Updating appointment ${currentId} status from ${apt.status} to confirmed`);
            // Preserve all original fields and just update status and timestamp
            return { 
              ...apt, 
              status: 'confirmed', 
              updated_at: new Date().toISOString(),
              // Ensure parent_id is preserved as a string
              parent_id: String(apt.parent_id) 
            };
          }
          return apt;
        });
        
        // Log the updated appointment for verification
        const updatedAppointment = updatedAppointments.find(apt => 
          String(apt.appointment_id || apt.id) === String(appointmentId)
        );
        console.log("🔄 Updated appointment data:", updatedAppointment);
        
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        console.log("💾 Saved updated appointments to localStorage");
      }

      // Play confirmation sound
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log('🔇 Audio play failed:', e));
      } catch (error) {
        console.log('🔇 Sound notification failed:', error);
      }

      // Show success toast
      toast({
        title: "Appointment Accepted",
        description: `Appointment for ${getChildName(appointment.child_id)} has been confirmed.`,
      });

      // Try to update the backend
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/${appointment.appointment_id || appointment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            status: 'confirmed' 
          })
        });

        if (!response.ok) {
          console.error('❌ Backend update failed, but UI was updated');
        }
      } catch (error) {
        console.error("❌ Backend API error:", error);
      }
    } catch (error) {
      console.error("❌ Error accepting appointment:", error);
      // Don't show error toast since we already updated the UI
    }
  };

  const handleRejectAppointment = async (appointment) => {
    try {
      console.log("❌ Rejecting appointment:", appointment);
      
      // Update local state optimistically first
      setAppointments(appointments.map(apt => 
        (apt.appointment_id || apt.id) === (appointment.appointment_id || appointment.id) 
          ? { ...apt, status: 'rejected' } 
          : apt
      ));

      // Update localStorage with better error handling and logging
      const storedAppointmentsJson = localStorage.getItem('appointments');
      if (storedAppointmentsJson) {
        const allAppointments = JSON.parse(storedAppointmentsJson);
        console.log("📋 All appointments before update:", allAppointments.length);
        
        const appointmentId = appointment.appointment_id || appointment.id;
        console.log(`🔍 Updating appointment ${appointmentId} to status: rejected`);
        
        // Log the parent ID for this appointment
        const parentId = appointment.parent_id;
        console.log(`👨‍👩‍👧‍👦 Parent ID for this appointment: ${parentId}`);
        
        const updatedAppointments = allAppointments.map(apt => {
          const currentId = apt.appointment_id || apt.id;
          if (String(currentId) === String(appointmentId)) {
            console.log(`✏️ Updating appointment ${currentId} status from ${apt.status} to rejected`);
            // Preserve all original fields and just update relevant fields
            return { 
              ...apt, 
              status: 'rejected', 
              rejection_reason: rejectionReason || "Unavailable for the requested time",
              updated_at: new Date().toISOString(),
              // Ensure parent_id is preserved as a string
              parent_id: String(apt.parent_id) 
            };
          }
          return apt;
        });
        
        // Log the updated appointment for verification
        const updatedAppointment = updatedAppointments.find(apt => 
          String(apt.appointment_id || apt.id) === String(appointmentId)
        );
        console.log("🔄 Updated appointment data:", updatedAppointment);
        
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        console.log("💾 Saved updated appointments to localStorage");
      }

      // Play notification sound
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log('🔇 Audio play failed:', e));
      } catch (error) {
        console.log('🔇 Sound notification failed:', error);
      }

      // Show success toast
      toast({
        title: "Appointment Rejected",
        description: `Appointment for ${getChildName(appointment.child_id)} has been rejected.`,
      });

      // Reset rejection reason for next use
      setRejectionReason("");
      setSelectedAppointment(null);

      // Try to update the backend
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/${appointment.appointment_id || appointment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            status: 'rejected',
            rejection_reason: rejectionReason || "Unavailable for the requested time"
          })
        });

        if (!response.ok) {
          console.error('❌ Backend update failed, but UI was updated');
        }
      } catch (error) {
        console.error("❌ Backend API error:", error);
      }
    } catch (error) {
      console.error("❌ Error rejecting appointment:", error);
      // Don't show error toast since we already updated the UI
    }
  };

  // New function to mark appointment as completed (with optimistic UI update)
  const handleCompleteAppointment = async (appointment) => {
    try {
      console.log("✅ Completing appointment:", appointment);
      
      // Update local state optimistically first
      setAppointments(appointments.map(apt => 
        (apt.appointment_id || apt.id) === (appointment.appointment_id || appointment.id) 
          ? { ...apt, status: 'completed' } 
          : apt
      ));

      // Update localStorage with better error handling and logging
      const storedAppointmentsJson = localStorage.getItem('appointments');
      if (storedAppointmentsJson) {
        const allAppointments = JSON.parse(storedAppointmentsJson);
        console.log("📋 All appointments before completion:", allAppointments.length);
        
        const appointmentId = appointment.appointment_id || appointment.id;
        console.log(`🔍 Updating appointment ${appointmentId} to status: completed`);
        
        // Log the parent ID for this appointment
        const parentId = appointment.parent_id;
        console.log(`👨‍👩‍👧‍👦 Parent ID for this appointment: ${parentId}`);
        
        const updatedAppointments = allAppointments.map(apt => {
          const currentId = apt.appointment_id || apt.id;
          if (String(currentId) === String(appointmentId)) {
            console.log(`✏️ Updating appointment ${currentId} status from ${apt.status} to completed`);
            return { 
              ...apt, 
              status: 'completed', 
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              // Ensure parent_id is preserved as a string
              parent_id: String(apt.parent_id)
            };
          }
          return apt;
        });
        
        // Log the updated appointment for verification
        const updatedAppointment = updatedAppointments.find(apt => 
          String(apt.appointment_id || apt.id) === String(appointmentId)
        );
        console.log("🔄 Updated appointment data:", updatedAppointment);
        
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        console.log("💾 Saved updated appointments to localStorage");
        
        // If this appointment was for a vaccine, update the vaccination record
        if (appointment.vaccine) {
          console.log(`💉 Appointment had vaccine: ${appointment.vaccine}`);
          
          // Update vaccination records
          try {
            const storedVaccinationsJson = localStorage.getItem('vaccinations');
            if (storedVaccinationsJson) {
              const allVaccinations = JSON.parse(storedVaccinationsJson);
              
              // Find corresponding vaccination record
              const vaccinationRecord = allVaccinations.find(vac => 
                String(vac.appointment_id) === String(appointmentId) ||
                String(vac.child_id) === String(appointment.child_id) && vac.vaccine_name === appointment.vaccine
              );
              
              if (vaccinationRecord) {
                console.log(`💉 Found vaccination record to update: ${vaccinationRecord.id}`);
                
                // Update the vaccination record
                const updatedVaccinations = allVaccinations.map(vac => {
                  if (vac.id === vaccinationRecord.id) {
                    return { 
                      ...vac, 
                      status: 'completed', 
                      vaccine_date: new Date().toISOString(),
                      updated_at: new Date().toISOString()
                    };
                  }
                  return vac;
                });
                
                // Save back to localStorage
                localStorage.setItem('vaccinations', JSON.stringify(updatedVaccinations));
                console.log("💾 Updated vaccination record");
              } else {
                console.log("⚠️ No matching vaccination record found, creating one");
                
                // Create a new vaccination record
                const vaccinationId = `vac_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                
                const newVaccinationRecord = {
                  id: vaccinationId,
                  vaccination_id: vaccinationId,
                  child_id: appointment.child_id,
                  appointment_id: appointmentId,
                  vaccine_name: appointment.vaccine,
                  vaccine_date: new Date().toISOString(),
                  status: "completed",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                
                // Add to existing records
                allVaccinations.push(newVaccinationRecord);
                
                // Save back to localStorage
                localStorage.setItem('vaccinations', JSON.stringify(allVaccinations));
                console.log("💾 Created and saved new vaccination record");
              }
            } else {
              // No vaccination records exist yet, create a new array
              console.log("⚠️ No vaccination records found, creating new array");
              
              const vaccinationId = `vac_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
              
              const newVaccinationRecord = {
                id: vaccinationId,
                vaccination_id: vaccinationId,
                child_id: appointment.child_id,
                appointment_id: appointmentId,
                vaccine_name: appointment.vaccine,
                vaccine_date: new Date().toISOString(),
                status: "completed",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              
              // Save to localStorage
              localStorage.setItem('vaccinations', JSON.stringify([newVaccinationRecord]));
              console.log("💾 Created first vaccination record");
            }
          } catch (error) {
            console.error("❌ Error updating vaccination records:", error);
          }
        }
      }

      // Play sound notification
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log('🔇 Audio play failed:', e));
      } catch (error) {
        console.log('🔇 Sound notification failed:', error);
      }

      // Show success toast
      toast({
        title: "Appointment Completed",
        description: `Appointment for ${getChildName(appointment.child_id)} has been marked as completed.`,
      });

      // Try to update the backend
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/${appointment.appointment_id || appointment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            status: 'completed' 
          })
        });

        if (!response.ok) {
          console.error('❌ Backend update failed, but UI was updated');
        }
      } catch (error) {
        console.error("❌ Backend API error:", error);
      }
    } catch (error) {
      console.error("❌ Error completing appointment:", error);
      // Don't show error toast since we already updated the UI
    }
  };

  // Function for My Schedule button (placeholder)
  const handleViewSchedule = () => {
    // TODO: Implement schedule view for the doctor
    toast({
      title: "Feature Coming Soon",
      description: "The My Schedule feature will be available in the next update.",
    });
  };

  // Function for Generate Report button (placeholder)
  const handleGenerateReport = () => {
    // TODO: Implement report generation
    toast({
      title: "Feature Coming Soon",
      description: "The Generate Report feature will be available in the next update.",
    });
  };

  // DEBUG function to help diagnose appointment issues
  const debugAppointments = () => {
    try {
      const storedAppointmentsJson = localStorage.getItem('appointments');
      if (!storedAppointmentsJson) {
        console.log("🔍 DEBUG: No appointments in localStorage");
        return;
      }
      
      const allAppointments = JSON.parse(storedAppointmentsJson);
      console.log("🔍 DEBUG: All appointments:", allAppointments);
      
      // Log all doctor IDs for comparison
      console.log("🔍 DEBUG: Current doctor ID:", currentDoctor?.id, "Type:", typeof currentDoctor?.id);
      
      // Convert all doctor_ids to strings and log them
      const doctorIds = allAppointments.map(apt => String(apt.doctor_id));
      console.log("🔍 DEBUG: All doctor_ids as strings:", doctorIds);
      
      // Check if any match the current doctor ID
      const matches = doctorIds.filter(id => id === String(currentDoctor?.id));
      console.log("🔍 DEBUG: Matches with current doctor ID:", matches);
      
      toast({
        title: `Debug Info - ${matches.length} matches found`,
        description: `Check console for detailed appointment debugging information.`,
      });
    } catch (error) {
      console.error("❌ DEBUG Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8 px-4">
        <div className="container max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600">Welcome back, Dr. {currentDoctor?.lastName || 'Doctor'}</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button variant="outline" className="gap-2" onClick={handleViewSchedule}>
                <Calendar className="h-4 w-4" />
                <span>My Schedule</span>
              </Button>
              <Button className="gap-2" onClick={handleGenerateReport}>
                <FileSpreadsheet className="h-4 w-4" />
                <span>Generate Report</span>
              </Button>
              {/* Add debug button */}
              <Button variant="destructive" className="gap-2" onClick={debugAppointments}>
                <span>Debug Appointments</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Patients</CardTitle>
                <CardDescription>Registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{parents.length}</div>
                  <Users className="h-8 w-8 text-vaccine-blue opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Pending Appointments</CardTitle>
                <CardDescription>Awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {appointments.filter(a => a.status === "scheduled" || a.status === "pending").length}
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Today's Appointments</CardTitle>
                <CardDescription>Scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {appointments.filter(a => {
                      const aptDate = new Date(a.appointment_date);
                      const today = new Date();
                      return aptDate.toDateString() === today.toDateString();
                    }).length}
                  </div>
                  <Calendar className="h-8 w-8 text-vaccine-green opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Confirmed Appointments</CardTitle>
                <CardDescription>Ready to administer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {appointments.filter(a => a.status === "confirmed").length}
                  </div>
                  <Activity className="h-8 w-8 text-vaccine-teal opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="appointments">
            <TabsList className="mb-6">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>
                        View and manage patient vaccination appointments
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Calendar View</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No appointments scheduled</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Child</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments
                          .filter(a => a.status !== "completed" && a.status !== "rejected")
                          .sort((a, b) => {
                            const dateA = new Date(a.appointment_date).getTime();
                            const dateB = new Date(b.appointment_date).getTime();
                            return dateA - dateB;
                          })
                          .map((appointment) => (
                            <TableRow key={appointment.appointment_id || appointment.id}>
                              <TableCell>
                                <div>
                                  <div>{getChildName(appointment.child_id)}</div>
                                  <div className="text-xs text-gray-500">{getChildAge(appointment.child_id)}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div>{appointment.reason || "General checkup"}</div>
                                  {appointment.vaccine_name && (
                                    <div className="text-xs text-gray-500">
                                      Vaccine: {appointment.vaccine_name}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div>{new Date(appointment.appointment_date).toLocaleDateString()}</div>
                                  <div className="text-xs text-gray-500">{appointment.appointment_time}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {appointment.status === "confirmed" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Confirmed
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {appointment.status === "scheduled" ? "Scheduled" : appointment.status}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {(appointment.status === "scheduled" || appointment.status === "pending") && (
                                    <>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="h-8 w-8 p-0 text-green-600"
                                        onClick={() => handleAcceptAppointment(appointment)}
                                      >
                                        <ThumbsUp className="h-4 w-4" />
                                        <span className="sr-only">Accept</span>
                                      </Button>
                                      
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="h-8 w-8 p-0 text-red-600"
                                            onClick={() => setSelectedAppointment(appointment)}
                                          >
                                            <ThumbsDown className="h-4 w-4" />
                                            <span className="sr-only">Reject</span>
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Reject Appointment</DialogTitle>
                                            <DialogDescription>
                                              Please provide a reason for rejecting this appointment. This will be shared with the parent.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="py-4">
                                            <Textarea 
                                              placeholder="Reason for rejection..."
                                              value={rejectionReason}
                                              onChange={(e) => setRejectionReason(e.target.value)}
                                              rows={4}
                                            />
                                          </div>
                                          <DialogFooter>
                                            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                                              Cancel
                                            </Button>
                                            <Button 
                                              variant="destructive" 
                                              onClick={() => handleRejectAppointment(appointment)}
                                              disabled={!rejectionReason.trim()}
                                            >
                                              Reject Appointment
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    </>
                                  )}
                                  
                                  {appointment.status === "confirmed" && (
                                    <>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="gap-1 text-blue-600"
                                      >
                                        Details
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="gap-1 bg-green-50 text-green-600 hover:bg-green-100"
                                        onClick={() => handleCompleteAppointment(appointment)}
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Done
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Completed Appointments Section */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Completed Appointments</CardTitle>
                      <CardDescription>
                        Previous completed appointments
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {appointments.filter(a => a.status === "completed").length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No completed appointments</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Child</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments
                          .filter(a => a.status === "completed")
                          .sort((a, b) => {
                            const dateA = new Date(a.appointment_date).getTime();
                            const dateB = new Date(b.appointment_date).getTime();
                            return dateB - dateA;
                          })
                          .map((appointment) => (
                            <TableRow key={appointment.appointment_id || appointment.id}>
                              <TableCell>
                                <div>
                                  <div>{getChildName(appointment.child_id)}</div>
                                  <div className="text-xs text-gray-500">{getChildAge(appointment.child_id)}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div>{appointment.reason || "General checkup"}</div>
                                  {appointment.vaccine_name && (
                                    <div className="text-xs text-gray-500">
                                      Vaccine: {appointment.vaccine_name}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div>{new Date(appointment.appointment_date).toLocaleDateString()}</div>
                                  <div className="text-xs text-gray-500">{appointment.appointment_time}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Completed
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Registered Patients</CardTitle>
                      <CardDescription>
                        View and manage registered families and their children
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-4 w-4" />
                      <span>Export List</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Child Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {children.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">No patients found</TableCell>
                        </TableRow>
                      ) : (
                        children.map((child) => (
                          <TableRow key={child.child_id || child.id}>
                            <TableCell className="font-medium">{child.first_name} {child.last_name}</TableCell>
                            <TableCell>{getChildAge(child.child_id || child.id)}</TableCell>
                            <TableCell className="capitalize">{child.gender}</TableCell>
                            <TableCell>{new Date(child.date_of_birth).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                View Records
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vaccination Analytics</CardTitle>
                    <CardDescription>
                      Vaccination coverage and trends over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Analytics visualization will appear here</p>
                      <p className="text-sm text-gray-400">
                        (Charts would be implemented with Recharts in the actual application)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Most Administered Vaccines</CardTitle>
                      <CardDescription>
                        Top vaccines by administration count
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-vaccine-blue rounded-full"></div>
                            <span>DTaP</span>
                          </div>
                          <span className="font-medium">32</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-vaccine-green rounded-full"></div>
                            <span>Influenza</span>
                          </div>
                          <span className="font-medium">28</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-vaccine-teal rounded-full"></div>
                            <span>MMR</span>
                          </div>
                          <span className="font-medium">26</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                            <span>Polio (IPV)</span>
                          </div>
                          <span className="font-medium">21</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                            <span>Hepatitis B</span>
                          </div>
                          <span className="font-medium">19</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Age Distribution</CardTitle>
                      <CardDescription>
                        Patient age groups
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>0-1 years</span>
                            <span>12 children</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-vaccine-blue w-[30%]"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>1-2 years</span>
                            <span>18 children</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-vaccine-blue w-[45%]"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>2-4 years</span>
                            <span>15 children</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-vaccine-blue w-[38%]"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>4-6 years</span>
                            <span>8 children</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-vaccine-blue w-[20%]"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>6+ years</span>
                            <span>7 children</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-vaccine-blue w-[17%]"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
