
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
  children: Child[];
  appointments: Appointment[];
  vaccinationHistory: Vaccination[];
}

export const PatientTabs = ({ children, appointments, vaccinationHistory }: PatientTabsProps) => {
  return (
    <Tabs defaultValue="children">
      <TabsList className="mb-6">
        <TabsTrigger value="children">My Children</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="history">Vaccination History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="children">
        <ChildrenList children={children} />
      </TabsContent>
      
      <TabsContent value="appointments">
        <AppointmentsList appointments={appointments} />
      </TabsContent>
      
      <TabsContent value="history">
        <VaccinationHistory vaccinations={vaccinationHistory} />
      </TabsContent>
    </Tabs>
  );
};
