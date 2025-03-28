export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  education: string;
  address: string;
  availability: string[];
  rating: number;
  image: string;
}

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    experience: 12,
    education: "MD - Cardiology, MBBS",
    address: "123 Medical Center, New York",
    availability: ["Mon-Fri", "9:00 AM - 5:00 PM"],
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialization: "Pediatrician",
    experience: 8,
    education: "MD - Pediatrics, MBBS",
    address: "456 Children's Hospital, Boston",
    availability: ["Mon-Sat", "10:00 AM - 6:00 PM"],
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: "3",
    name: "Dr. Emily Brown",
    specialization: "Dermatologist",
    experience: 10,
    education: "MD - Dermatology, MBBS",
    address: "789 Skin Care Clinic, Los Angeles",
    availability: ["Tue-Sat", "11:00 AM - 7:00 PM"],
    rating: 4.7,
    image: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialization: "Orthopedic Surgeon",
    experience: 15,
    education: "MD - Orthopedics, MBBS",
    address: "321 Bone & Joint Center, Chicago",
    availability: ["Mon-Fri", "8:00 AM - 4:00 PM"],
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    id: "5",
    name: "Dr. Lisa Martinez",
    specialization: "Neurologist",
    experience: 11,
    education: "MD - Neurology, MBBS",
    address: "654 Brain & Spine Institute, Houston",
    availability: ["Mon-Thu", "9:00 AM - 6:00 PM"],
    rating: 4.8,
    image: "https://randomuser.me/api/portraits/women/5.jpg"
  }
];
