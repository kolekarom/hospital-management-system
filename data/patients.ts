export interface Patient {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  medicalHistory: {
    condition: string;
    diagnosedDate: string;
    status: string;
  }[];
  contactNumber: string;
  address: string;
}

export const patients: Patient[] = [
  {
    id: "P001",
    name: "John Smith",
    email: "john.smith@example.com",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    bloodGroup: "O+",
    allergies: ["Penicillin", "Peanuts"],
    medicalHistory: [
      {
        condition: "Asthma",
        diagnosedDate: "2010-03-20",
        status: "Controlled"
      }
    ],
    contactNumber: "+1234567890",
    address: "123 Main St, City"
  },
  {
    id: "P002",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    dateOfBirth: "1985-08-22",
    gender: "Female",
    bloodGroup: "A+",
    allergies: ["Aspirin"],
    medicalHistory: [
      {
        condition: "Hypertension",
        diagnosedDate: "2018-06-15",
        status: "Managed"
      }
    ],
    contactNumber: "+1987654321",
    address: "456 Oak Ave, Town"
  }
];
