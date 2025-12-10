// src/data/freelancers.js
export const freelancers = [
  {
    id: '1',
    name: 'Alex Johnson',
    title: 'Full-stack JavaScript Developer',
    rate: '$40/hr',
    location: 'Remote · UTC+1',
    overview:
      'Full-stack developer with 6+ years of experience building SaaS products, admin dashboards, and REST APIs. I focus on clean, maintainable code and great UX.',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Docker'],
    stats: {
      jobsCompleted: 48,
      hoursWorked: 2100,
      jobSuccess: '98%',
      memberSince: '2018',
    },
    experiences: [
      {
        role: 'Senior Frontend Engineer',
        company: 'SaaSly',
        period: '2021 – Present',
        summary:
          'Led the frontend team building a multi-tenant analytics platform with React and TypeScript.',
      },
      {
        role: 'Full-stack Developer',
        company: 'DevWorks',
        period: '2018 – 2021',
        summary:
          'Worked on various client projects, from MVPs to production-scale applications.',
      },
    ],
  },
  {
    id: '2',
    name: 'Sara Lee',
    title: 'UI/UX Designer',
    rate: '$35/hr',
    location: 'Remote · UTC-5',
    overview:
      'Product designer specializing in SaaS dashboards and mobile apps. I create flows and interfaces that feel intuitive and delightful.',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
    stats: {
      jobsCompleted: 32,
      hoursWorked: 1200,
      jobSuccess: '95%',
      memberSince: '2019',
    },
    experiences: [
      {
        role: 'Product Designer',
        company: 'Flowly',
        period: '2020 – Present',
        summary:
          'Own the design of core product flows, work closely with PM and engineering.',
      },
    ],
  },
  {
    id: '3',
    name: 'Rahul Verma',
    title: 'Backend Engineer',
    rate: '$45/hr',
    location: 'Remote · UTC+5:30',
    overview:
      'Backend engineer with focus on Node.js microservices, PostgreSQL, and Redis. I care about performance and reliability.',
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'Microservices', 'AWS'],
    stats: {
      jobsCompleted: 41,
      hoursWorked: 1800,
      jobSuccess: '99%',
      memberSince: '2017',
    },
    experiences: [
      {
        role: 'Backend Engineer',
        company: 'CloudOps',
        period: '2019 – Present',
        summary:
          'Designed and implemented microservices for a large-scale B2B platform.',
      },
    ],
  },
];

export function getFreelancerById(id) {
  return freelancers.find((f) => f.id === id);
}
