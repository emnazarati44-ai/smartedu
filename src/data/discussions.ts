export interface DiscussionPost {
  id: string;
  author: string;
  authorRole: 'student' | 'professor' | 'admin';
  authorAvatar: string;
  courseId?: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: DiscussionReply[];
  tags: string[];
}

export interface DiscussionReply {
  id: string;
  author: string;
  authorRole: 'student' | 'professor' | 'admin';
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export const initialDiscussions: DiscussionPost[] = [
  {
    id: 'd1',
    author: 'Alex Johnson',
    authorRole: 'student',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    courseId: 'cs101',
    title: 'Help with recursion in Assignment 3',
    content: 'I\'m struggling with the recursive function in Assignment 3. Can someone explain how the call stack works in this context? I keep getting a stack overflow error.',
    timestamp: '2025-10-15T14:30:00',
    likes: 12,
    tags: ['CS 101', 'Help', 'Programming'],
    replies: [
      {
        id: 'r1',
        author: 'Dr. Sarah Chen',
        authorRole: 'professor',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        content: 'Great question, Alex! Make sure you have a proper base case. The stack overflow usually means your recursion never terminates. Check if your base case condition is being met. I\'ll cover this in detail in tomorrow\'s lecture.',
        timestamp: '2025-10-15T15:45:00',
        likes: 8,
      },
      {
        id: 'r2',
        author: 'Maya Patel',
        authorRole: 'student',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        content: 'I had the same issue! Try adding a print statement before each recursive call to trace the execution. It helped me understand where things go wrong.',
        timestamp: '2025-10-15T16:20:00',
        likes: 5,
      },
    ],
  },
  {
    id: 'd2',
    author: 'Dr. James Wilson',
    authorRole: 'professor',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    courseId: 'cs201',
    title: 'Important: Midterm Exam Format Change',
    content: 'Due to popular request, the midterm will now be open-book. You may bring your textbook and printed notes. Electronic devices are still not permitted. The exam will cover chapters 1-6.',
    timestamp: '2025-10-14T09:00:00',
    likes: 45,
    tags: ['CS 201', 'Announcement', 'Exam'],
    replies: [
      {
        id: 'r3',
        author: 'Jordan Rivera',
        authorRole: 'student',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        content: 'Thank you, Professor Wilson! This is great news. Will the practice problems still be available on the course portal?',
        timestamp: '2025-10-14T10:15:00',
        likes: 3,
      },
    ],
  },
  {
    id: 'd3',
    author: 'Admin Office',
    authorRole: 'admin',
    authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    title: 'Campus Wi-Fi Maintenance - October 20th',
    content: 'Please be advised that campus Wi-Fi will undergo scheduled maintenance on October 20th from 2:00 AM to 6:00 AM. During this time, internet access may be intermittent. We apologize for any inconvenience.',
    timestamp: '2025-10-13T11:00:00',
    likes: 8,
    tags: ['Announcement', 'Campus', 'IT'],
    replies: [],
  },
  {
    id: 'd4',
    author: 'Sophie Williams',
    authorRole: 'student',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    courseId: 'math101',
    title: 'Study group for Calculus midterm?',
    content: 'Hey everyone! Is anyone interested in forming a study group for the Calculus I midterm? I was thinking we could meet at the library on weekends. Drop a reply if you\'re interested!',
    timestamp: '2025-10-12T18:30:00',
    likes: 22,
    tags: ['MATH 101', 'Study Group', 'Calculus'],
    replies: [
      {
        id: 'r4',
        author: 'Chris Taylor',
        authorRole: 'student',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        content: 'Count me in! Saturday afternoons work best for me. Should we book a study room?',
        timestamp: '2025-10-12T19:00:00',
        likes: 4,
      },
      {
        id: 'r5',
        author: 'Emma Davis',
        authorRole: 'student',
        authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
        content: 'I\'m interested too! I can help with derivatives but need help with integration. Let\'s share our strengths!',
        timestamp: '2025-10-12T20:15:00',
        likes: 6,
      },
    ],
  },
  {
    id: 'd5',
    author: 'Dr. Emily Rodriguez',
    authorRole: 'professor',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    courseId: 'math101',
    title: 'Extra Office Hours This Week',
    content: 'I\'ll be holding extra office hours this Thursday and Friday from 3-5 PM in Room 302. Come prepared with your questions about integration techniques. No appointment needed!',
    timestamp: '2025-10-11T08:00:00',
    likes: 18,
    tags: ['MATH 101', 'Office Hours', 'Announcement'],
    replies: [],
  },
  {
    id: 'd6',
    author: 'Ryan Chen',
    authorRole: 'student',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop',
    courseId: 'cs301',
    title: 'Best resources for understanding neural networks?',
    content: 'Beyond the course materials, what are some good resources for understanding neural networks? I\'m looking for both theoretical explanations and practical tutorials. Any recommendations?',
    timestamp: '2025-10-10T16:45:00',
    likes: 31,
    tags: ['CS 301', 'Resources', 'Machine Learning'],
    replies: [
      {
        id: 'r6',
        author: 'Dr. Sarah Chen',
        authorRole: 'professor',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        content: 'Great initiative, Ryan! I recommend "Deep Learning" by Goodfellow et al. for theory, and fast.ai courses for practical implementation. I\'ll add these to the course resources page.',
        timestamp: '2025-10-10T17:30:00',
        likes: 15,
      },
    ],
  },
];
