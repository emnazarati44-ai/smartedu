// Types kept for backward compatibility - data now comes from database
export interface Course {
  id: string;
  title: string;
  code: string;
  department: string;
  professor_name: string;
  professor_avatar: string;
  professor_id?: string | null;
  semester: string;
  credits: number;
  max_capacity: number;
  enrollment_count: number;
  description: string;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  modules: { id: string; title: string; duration: string; order_index: number }[];
  announcements: { id: string; title: string; content: string; created_at: string }[];
}

export const departments = [
  'All Departments',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Business',
  'Engineering',
  'Arts & Humanities',
  'Biology',
];

export const semesters = ['All Semesters', 'Fall 2025', 'Spring 2026', 'Summer 2026'];
export const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];


export const mockCourses = [
  {
    id: "1",
    title: "Web Development Basics",
    description: "Learn HTML, CSS, JS",
    instructor: "Admin",
  },
  {
    id: "2",
    title: "React for Beginners",
    description: "Intro to React",
    instructor: "Admin",
  }
];
