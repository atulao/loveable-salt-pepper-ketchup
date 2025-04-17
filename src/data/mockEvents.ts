export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  endTime: string;
  categories: string[];
  hasFreeFood: boolean;
  image?: string;
  organizerName?: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: "Free Pizza & Programming Workshop",
    description: "Join us for a hands-on programming workshop where you'll learn the basics of Python while enjoying free pizza! Perfect for beginners and experienced coders alike.",
    location: "GITC 1400",
    date: "2025-04-20",
    time: "12:30 PM",
    endTime: "2:00 PM",
    categories: ["Academic", "Food", "Technology"],
    hasFreeFood: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000",
    organizerName: "ACM Student Chapter"
  },
  {
    id: "2",
    title: "Engineering Career Fair",
    description: "Meet with top engineering companies recruiting for internships and full-time positions. Bring your resume and dress professionally.",
    location: "Campus Center Ballroom",
    date: "2025-04-22",
    time: "10:00 AM",
    endTime: "3:00 PM",
    categories: ["Career", "Networking"],
    hasFreeFood: false,
    image: "https://images.unsplash.com/photo-1559644981-5a6f4b371d77?q=80&w=1000",
    organizerName: "Career Services"
  },
  {
    id: "3",
    title: "Commuter Student Lunch Meetup",
    description: "A special networking lunch for commuter students to meet each other and learn about resources available specifically for commuters.",
    location: "Campus Center 2nd Floor Lounge",
    date: "2025-04-17",
    time: "11:30 AM",
    endTime: "1:00 PM",
    categories: ["Social", "Food", "Commuter"],
    hasFreeFood: true,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000",
    organizerName: "Student Life"
  },
  {
    id: "4",
    title: "Late Night Study Session",
    description: "Join fellow students for a productive late-night study session with coffee, snacks, and peer tutoring available.",
    location: "Van Houten Library",
    date: "2025-04-18",
    time: "7:00 PM",
    endTime: "11:00 PM",
    categories: ["Academic", "Resident"],
    hasFreeFood: false,
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1000",
    organizerName: "Van Houten Library"
  },
  {
    id: "5",
    title: "Free Breakfast & Biology Seminar",
    description: "Start your day with a free breakfast while attending an informative seminar on the latest advances in biotechnology.",
    location: "Tiernan Hall 101",
    date: "2025-04-19",
    time: "9:00 AM",
    endTime: "10:30 AM",
    categories: ["Academic", "Food", "Science"],
    hasFreeFood: true,
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=1000",
    organizerName: "Biology Department"
  },
  {
    id: "6",
    title: "Residence Hall Movie Night",
    description: "Join us for a screening of the latest blockbuster with free popcorn and drinks. Open to all residence hall students.",
    location: "Redwood Hall Lounge",
    date: "2025-04-21",
    time: "8:00 PM",
    endTime: "10:30 PM",
    categories: ["Social", "Entertainment", "Resident"],
    hasFreeFood: true,
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000",
    organizerName: "Residence Life"
  },
  {
    id: "7",
    title: "Commuter Lounge Open House",
    description: "Discover the newly renovated commuter lounge with free coffee, comfortable seating, and lockers for commuter students.",
    location: "Campus Center 4th Floor",
    date: "2025-04-23",
    time: "10:00 AM",
    endTime: "4:00 PM",
    categories: ["Commuter", "Social"],
    hasFreeFood: false,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000",
    organizerName: "Student Government Association"
  },
  {
    id: "8",
    title: "Hackathon Kickoff",
    description: "Join the 24-hour hackathon where students collaborate to build innovative technology solutions. Meals and snacks provided.",
    location: "GITC Building",
    date: "2025-04-26",
    time: "9:00 AM",
    endTime: "9:00 AM (next day)",
    categories: ["Technology", "Competition", "Food"],
    hasFreeFood: true,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000",
    organizerName: "NJIT Hackers"
  }
];

// Export the events array as mockEvents for backwards compatibility
export const mockEvents = events;
