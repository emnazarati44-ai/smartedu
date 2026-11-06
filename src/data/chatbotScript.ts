export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
  timestamp: Date;
}

export interface ChatOption {
  trigger: string;
  response: string;
  followUpOptions?: string[];
}

export const welcomeMessage: ChatMessage = {
  id: 'welcome',
  sender: 'bot',
  text: 'Hello! I\'m SmartEdu Assistant. How can I help you today? Choose a topic below or type your question.',
  options: [
    'How do I sign up?',
    'How to browse courses?',
    'How to enroll in a course?',
    'Professor dashboard help',
    'Discussion board guide',
    'Account settings',
    'Contact support',
  ],
  timestamp: new Date(),
};

export const chatResponses: Record<string, ChatOption> = {
  'how do i sign up?': {
    trigger: 'how do i sign up?',
    response: 'To sign up for SmartEdu:\n\n1. Click the "Sign Up" button in the top navigation bar\n2. Fill in your full name, email address, and create a password\n3. Select your role: Student, Professor, or Administration\n4. Click "Create Account"\n5. You\'re all set! You can now log in and access all features.\n\nNeed help with something else?',
    followUpOptions: ['How to browse courses?', 'Account settings', 'Back to main menu'],
  },
  'how to browse courses?': {
    trigger: 'how to browse courses?',
    response: 'To browse courses on SmartEdu:\n\n1. Navigate to the "Courses" section from the main page\n2. Use the search bar to find specific courses by name or code\n3. Filter courses by department, semester, or difficulty level\n4. Click on any course card to see full details\n5. View the syllabus, modules, and professor information\n\nYou can also sort courses by rating, enrollment, or name!',
    followUpOptions: ['How to enroll in a course?', 'Discussion board guide', 'Back to main menu'],
  },
  'how to enroll in a course?': {
    trigger: 'how to enroll in a course?',
    response: 'To enroll in a course:\n\n1. Browse the course catalog and find your desired course\n2. Click on the course card to open the course details\n3. Review the course information, modules, and schedule\n4. Click the "Enroll Now" button\n5. Confirm your enrollment\n\nNote: Some courses may have prerequisites or capacity limits. Check with your academic advisor if you have questions about eligibility.',
    followUpOptions: ['How to browse courses?', 'Professor dashboard help', 'Back to main menu'],
  },
  'professor dashboard help': {
    trigger: 'professor dashboard help',
    response: 'The Professor Dashboard provides:\n\n1. **Course Overview**: See all your active courses at a glance\n2. **Student Progress**: Track individual student completion rates\n3. **Engagement Metrics**: View participation and activity data\n4. **Grade Distribution**: Analyze grade patterns across your courses\n5. **Announcements**: Post updates for your students\n\nAccess the dashboard by clicking "Dashboard" in the navigation bar (available for Professor accounts only).',
    followUpOptions: ['Discussion board guide', 'Account settings', 'Back to main menu'],
  },
  'discussion board guide': {
    trigger: 'discussion board guide',
    response: 'The Discussion Board allows you to:\n\n1. **Start Discussions**: Create new topics in any course forum\n2. **Reply to Posts**: Engage with classmates and professors\n3. **Share Resources**: Attach files and links to your posts\n4. **Stay Updated**: Get notifications for replies to your posts\n\nAll members (students, professors, and admin) can participate in discussions. Be respectful and follow the community guidelines!',
    followUpOptions: ['How to enroll in a course?', 'Contact support', 'Back to main menu'],
  },
  'account settings': {
    trigger: 'account settings',
    response: 'To manage your account:\n\n1. Click on your profile avatar in the top-right corner\n2. Select "Profile" to view and edit your information\n3. Update your name, email, or profile picture\n4. Change your password in the Security section\n5. Manage notification preferences\n\nIf you need to change your role (Student/Professor/Admin), please contact the administration office.',
    followUpOptions: ['How do I sign up?', 'Contact support', 'Back to main menu'],
  },
  'contact support': {
    trigger: 'contact support',
    response: 'Need additional help? Here are your options:\n\n1. **Email**: support@smartedu.university\n2. **Phone**: +1 (555) 123-4567 (Mon-Fri, 9AM-5PM)\n3. **Office**: Student Services Building, Room 201\n4. **Live Chat**: Available during business hours\n\nFor urgent technical issues, please email with "URGENT" in the subject line.',
    followUpOptions: ['Back to main menu'],
  },
  'back to main menu': {
    trigger: 'back to main menu',
    response: 'Sure! What would you like to know about?',
    followUpOptions: [
      'How do I sign up?',
      'How to browse courses?',
      'How to enroll in a course?',
      'Professor dashboard help',
      'Discussion board guide',
      'Account settings',
      'Contact support',
    ],
  },
};

export const defaultResponse: ChatOption = {
  trigger: 'default',
  response: 'I\'m not sure I understand that question. Let me help you with one of these topics:',
  followUpOptions: [
    'How do I sign up?',
    'How to browse courses?',
    'How to enroll in a course?',
    'Professor dashboard help',
    'Discussion board guide',
    'Account settings',
    'Contact support',
  ],
};