
export interface Building {
  id: string;
  name: string;
  code: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  floors: number;
  departments: string[];
  amenities: string[];
  image?: string;
}

export const buildings: Building[] = [
  {
    id: "1",
    name: "Central King Building",
    code: "CKB",
    description: "Former high school building converted to a state-of-the-art technology center. Home to classrooms, labs, and the NCE Dean's office.",
    address: "180 Dr Martin Luther King Jr Blvd, Newark, NJ 07102",
    coordinates: {
      lat: 40.7432,
      lng: -74.1776
    },
    floors: 5,
    departments: ["Dean's Office", "Electrical & Computer Engineering", "Makerspace"],
    amenities: ["Classrooms", "Computer Labs", "Makerspace", "Study Areas"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000",
  },
  {
    id: "2",
    name: "Campus Center",
    code: "CC",
    description: "The hub of campus life at NJIT with dining options, student services, and event spaces.",
    address: "150 Bleeker St, Newark, NJ 07102",
    coordinates: {
      lat: 40.7416,
      lng: -74.1780
    },
    floors: 4,
    departments: ["Student Life", "Career Development Services", "Dining Services"],
    amenities: ["Food Court", "Ballroom", "Game Room", "Bookstore", "ATMs"],
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000",
  },
  {
    id: "3",
    name: "Tiernan Hall",
    code: "TIER",
    description: "Academic building housing engineering departments including Civil and Environmental Engineering.",
    address: "161 Warren St, Newark, NJ 07102",
    coordinates: {
      lat: 40.7424,
      lng: -74.1795
    },
    floors: 5,
    departments: ["Civil Engineering", "Environmental Engineering", "Chemistry"],
    amenities: ["Classrooms", "Research Labs", "Computer Labs"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1000",
  }
];
