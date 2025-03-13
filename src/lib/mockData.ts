
// Mock children data
export const MOCK_CHILDREN = [
  {
    id: "c1",
    name: "Emma Smith",
    dateOfBirth: "2020-05-12",
    gender: "Female",
    completedVaccines: 8,
    upcomingVaccines: 2
  }
];

// Mock appointments data
export const MOCK_APPOINTMENTS = [
  {
    id: "a1",
    childName: "Emma Smith",
    vaccineName: "DTaP (Diphtheria, Tetanus, Pertussis)",
    doctorName: "Dr. Sarah Smith",
    date: "2023-11-15",
    time: "10:00 AM",
    status: "confirmed"
  },
  {
    id: "a2",
    childName: "Emma Smith",
    vaccineName: "Influenza (Flu)",
    doctorName: "Dr. Sarah Smith",
    date: "2023-12-20",
    time: "2:30 PM",
    status: "pending"
  }
];

// Mock vaccination history
export const MOCK_VACCINATION_HISTORY = [
  {
    id: "v1",
    childName: "Emma Smith",
    vaccineName: "Hepatitis B",
    date: "2020-05-15",
    doctorName: "Dr. James Wilson",
    notes: "First dose administered at birth",
    certificateAvailable: true
  },
  {
    id: "v2",
    childName: "Emma Smith",
    vaccineName: "DTaP",
    date: "2020-07-12",
    doctorName: "Dr. Sarah Smith",
    notes: "First dose administered",
    certificateAvailable: true
  },
  {
    id: "v3",
    childName: "Emma Smith",
    vaccineName: "Polio (IPV)",
    date: "2020-07-12",
    doctorName: "Dr. Sarah Smith",
    notes: "First dose administered",
    certificateAvailable: true
  }
];
