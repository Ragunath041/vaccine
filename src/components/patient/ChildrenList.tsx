import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar, User, Activity, Droplet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { children as childrenApi, vaccinationRecords as vaccinationRecordsApi } from "@/services/api";

interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  completedVaccines: number;
  upcomingVaccines: number;
}

interface ChildrenListProps {
  children: Child[];
  onChildAdded?: () => void;
  onScheduleVaccine?: (childId: string) => void;
}

export const ChildrenList = ({ children, onChildAdded, onScheduleVaccine }: ChildrenListProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const { toast } = useToast();

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

      console.log("Sending child data:", childData);

      const response = await childrenApi.create(childData);
      console.log("Response data:", response.data);
      
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
      
      // Notify parent component to refresh children list
      if (onChildAdded) {
        onChildAdded();
      }
    } catch (error) {
      console.error("Error adding child:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add child"
      });
    }
  };
  
  // Handle viewing child details
  const handleViewDetails = async (child: Child) => {
    setSelectedChild(child);
    
    try {
      // Fetch vaccination records for the child
      const response = await vaccinationRecordsApi.getByChild(child.id);
      setVaccinationRecords(response.data || []);
    } catch (error) {
      console.error("Error fetching vaccination records:", error);
      setVaccinationRecords([]);
    }
    
    setIsDetailsDialogOpen(true);
  };
  
  // Handle scheduling vaccine
  const handleScheduleVaccine = (childId: string) => {
    if (onScheduleVaccine) {
      onScheduleVaccine(childId);
    } else {
      // If no callback is provided, show a message
      toast({
        title: "Schedule Vaccine",
        description: "Please go to the Appointments tab to schedule a vaccine.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children.map(child => (
        <Card key={child.id} className="overflow-hidden">
          <div className="h-2 bg-vaccine-blue"></div>
          <CardHeader>
            <CardTitle>{child.name}</CardTitle>
            <CardDescription>
              Born: {new Date(child.dateOfBirth).toLocaleDateString()}, {child.gender}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Completed Vaccines</p>
                <p className="text-2xl font-bold text-vaccine-blue">{child.completedVaccines}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">Upcoming Vaccines</p>
                <p className="text-2xl font-bold text-vaccine-green">{child.upcomingVaccines}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => handleViewDetails(child)}>View Details</Button>
              <Button size="sm" onClick={() => handleScheduleVaccine(child.id)}>Schedule Vaccine</Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Add Child Card */}
      <Card 
        className="flex flex-col items-center justify-center p-6 border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Add a Child</h3>
        <p className="text-gray-500 text-center mb-4">
          Register your child to manage their vaccinations
        </p>
        <Button variant="outline">Add Child</Button>
      </Card>
      
      {/* Add Child Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
      
      {/* Child Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Child Details</DialogTitle>
          </DialogHeader>
          {selectedChild && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4">
                <div className="bg-vaccine-light w-16 h-16 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-vaccine-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedChild.name}</h3>
                  <p className="text-sm text-gray-500">
                    Born: {new Date(selectedChild.dateOfBirth).toLocaleDateString()}, {selectedChild.gender}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-vaccine-blue" />
                    <h4 className="font-medium">Vaccination Status</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="text-lg font-bold text-vaccine-blue">{selectedChild.completedVaccines}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Upcoming</p>
                      <p className="text-lg font-bold text-vaccine-green">{selectedChild.upcomingVaccines}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-vaccine-blue" />
                    <h4 className="font-medium">Next Appointment</h4>
                  </div>
                  {selectedChild.upcomingVaccines > 0 ? (
                    <p className="text-sm">Upcoming appointment scheduled</p>
                  ) : (
                    <p className="text-sm text-gray-500">No upcoming appointments</p>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      handleScheduleVaccine(selectedChild.id);
                    }}
                  >
                    Schedule Vaccine
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Vaccination History</h4>
                {vaccinationRecords.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {vaccinationRecords.map((record: any) => (
                      <div key={record.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{record.vaccine_name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(record.vaccination_date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No vaccination records found</p>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
