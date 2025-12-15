// src/data/projects.js
export const projects = [
  {
    id: '1',
    title: 'React frontend dev for dashboard',
    type: 'Hourly',
    level: 'Intermediate',
    budget: '$25–$40/hr',
    tags: ['React', 'CSS', 'Charts'],
    postedAgo: '3 hours ago',
    projectType: 'Ongoing project',
    description:
      'We need an experienced React developer to build an analytics dashboard with charts, filters, and a responsive layout. You will work closely with our backend team and designer.',
    responsibilities: [
      'Build responsive UI components using React',
      'Integrate with REST APIs provided by our backend',
      'Implement charts and data visualizations',
      'Collaborate via Git and follow our coding standards',
    ],
    client: {
      name: 'Acme Analytics',
      location: 'Remote · Worldwide',
      memberSince: '2021',
      totalSpent: '$40k+',
      projectsPosted: 27,
    },
  },
  {
    id: '2',
    title: 'Node.js API developer',
    type: 'Fixed',
    level: 'Expert',
    budget: '$1500',
    tags: ['Node.js', 'REST', 'MongoDB'],
    postedAgo: '1 day ago',
    projectType: 'One-time project',
    description:
      'Looking for an expert Node.js developer to build a secure REST API for our mobile app, including authentication, payments integration, and admin reporting endpoints.',
    responsibilities: [
      'Design and implement RESTful endpoints',
      'Set up authentication and authorization',
      'Integrate with third-party payment providers',
      'Write basic integration tests',
    ],
    client: {
      name: 'Mobility Labs',
      location: 'Berlin, Germany',
      memberSince: '2019',
      totalSpent: '$120k+',
      projectsPosted: 55,
    },
  },
  {
    id: '3',
    title: 'Figma to responsive HTML/CSS',
    type: 'Hourly',
    level: 'Beginner',
    budget: '$10–$20/hr',
    tags: ['HTML', 'CSS', 'Responsive'],
    postedAgo: '2 days ago',
    projectType: 'Short term',
    description:
      'We have several Figma designs that need to be converted into pixel-perfect responsive HTML/CSS pages. Clean, semantic markup is important.',
    responsibilities: [
      'Convert Figma designs into HTML/CSS',
      'Ensure cross-browser compatibility',
      'Optimize for mobile and tablet devices',
    ],
    client: {
      name: 'Bright Studio',
      location: 'London, UK',
      memberSince: '2020',
      totalSpent: '$15k+',
      projectsPosted: 12,
    },
  },
];

export function getProjectById(id) {
  return projects.find((project) => project.id === id);
}
