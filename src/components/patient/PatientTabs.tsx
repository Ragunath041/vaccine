import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChildrenList } from "./ChildrenList";
import { AppointmentsList } from "./AppointmentsList";
import { VaccinationHistory } from "./VaccinationHistory";

// Types for data
interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  completedVaccines: number;
  upcomingVaccines: number;
}

interface Appointment {
  id: string;
  childName: string;
  vaccineName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
}

interface Vaccination {
  id: string;
  childName: string;
  vaccineName: string;
  date: string;
  doctorName: string;
  notes: string;
  certificateAvailable: boolean;
}

interface PatientTabsProps {
  children: any[];
  appointments: any[];
  vaccinationHistory?: any[];
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onChildAdded?: () => void;
  onAppointmentBooked?: () => void;
  onScheduleVaccine?: (childId: string) => void;
  onRefreshVaccinationHistory?: () => void;
}

export const PatientTabs = ({ 
  children, 
  appointments, 
  vaccinationHistory = [], 
  activeTab = "children",
  setActiveTab,
  onChildAdded,
  onAppointmentBooked,
  onScheduleVaccine,
  onRefreshVaccinationHistory
}: PatientTabsProps) => {
  const handleTabChange = (value: string) => {
    if (setActiveTab) {
      setActiveTab(value);
    }
  };

  return (
    <Tabs defaultValue="children" value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="children">Children</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="history">Vaccination History</TabsTrigger>
      </TabsList>
      <TabsContent value="children" className="mt-6">
        <ChildrenList 
          children={children} 
          onChildAdded={onChildAdded} 
          onScheduleVaccine={onScheduleVaccine}
        />
      </TabsContent>
      <TabsContent value="appointments" className="mt-6">
        <AppointmentsList 
          appointments={appointments} 
          onAppointmentBooked={onAppointmentBooked} 
          onViewVaccinationRecords={onRefreshVaccinationHistory}
        />
      </TabsContent>
      <TabsContent value="history" className="mt-6">
        <VaccinationHistory records={vaccinationHistory} onRefresh={onRefreshVaccinationHistory} />
      </TabsContent>
    </Tabs>
  );
};
