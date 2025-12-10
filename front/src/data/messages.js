// src/data/messages.js

export const messageThreads = [
  {
    id: '1',
    participantName: 'Alex Johnson',
    participantRole: 'Freelancer',
    jobTitle: 'React frontend dev for dashboard',
    lastActive: '2 hours ago',
    messages: [
      {
        id: 'm8',
        from: 'them',
        text: 'Yes,i will share first drafts by Wednesday.',
        time: '15:07',
      },
    ],
  },
  {
    id: '2',
    participantName: 'Sara Lee',
    participantRole: 'Freelancer',
    jobTitle: 'Landing page design for SaaS product',
    lastActive: 'Yesterday',
    messages: [
      {
        id: 'm1',
        from: 'me',
        text: 'Hi Sara, I like your portfolio. Are you available next week?',
        time: '15:02',
      },
      {
        id: 'm2',
        from: 'them',
        text: 'Yes, I can start on Monday and share first drafts by Wednesday.',
        time: '15:07',
      },
      {
        id: 'm3',
        from: 'them',
        text: 'Sure, here are a couple of dashboards I built recently.',
        time: '10:21',
      },
      {
        id: 'm4',
        from: 'me',
        text: 'Hi Sara, I like your portfolio. Are you available next week?',
        time: '15:02',
      },
      {
        id: 'm5',
        from: 'them',
        text: 'Yes, I can start on Monday and share first drafts by Wednesday.',
        time: '15:07',
      },
    ],
  },
  {
    id: '4',
    participantName: 'Sara Lee',
    participantRole: 'Freelancer',
    jobTitle: 'Landing page design for SaaS product',
    lastActive: 'Yesterday',
    messages: [
      {
        id: 'm1',
        from: 'me',
        text: 'Hi Sara, I like your portfolio. Are you available next week?',
        time: '15:02',
      },
      {
        id: 'm2',
        from: 'them',
        text: 'Yes, I can start on Monday and share first drafts by Wednesday.',
        time: '15:07',
      },
      {
        id: 'm3',
        from: 'them',
        text: 'Sure, here are a couple of dashboards I built recently.',
        time: '10:21',
      },
      {
        id: 'm4',
        from: 'me',
        text: 'Hi Sara, I like your portfolio. Are you available next week?',
        time: '15:02',
      },
      {
        id: 'm5',
        from: 'them',
        text: 'Yes, I can start on Monday and share first drafts by Wednesday.',
        time: '15:07',
      },
    ],
  },
  {
    id: '3',
    participantName: 'Sara Lee',
    participantRole: 'Freelancer',
    jobTitle: 'Landing page design for SaaS product',
    lastActive: 'Yesterday',
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: 'Hi, I saw your job about the React dashboard and would love to help.',
        time: '10:15',
      },
      {
        id: 'm2',
        from: 'me',
        text: 'Hi Alex, thanks for reaching out. Can you share some examples of your work?',
        time: '10:18',
      },
      {
        id: 'm3',
        from: 'them',
        text: 'Sure, here are a couple of dashboards I built recently.',
        time: '10:21',
      },
      {
        id: 'm4',
        from: 'me',
        text: 'Hi Sara, I like your portfolio. Are you available next week?',
        time: '15:02',
      },
      {
        id: 'm5',
        from: 'them',
        text: 'Yes, I can start on Monday and share first drafts by Wednesday.',
        time: '15:07',
      },
      {
        id: 'm6',
        from: 'me',
        text: 'Hi Sara, I like your portfolio. Are you available next week?',
        time: '15:02',
      },
      {
        id: 'm7',
        from: 'them',
        text: 'Yes, I can start on Monday and share first drafts by Wednesday.',
        time: '15:07',
      },
      {
        id: 'm8',
        from: 'them',
        text: 'Yes,i will share first drafts by Wednesday.',
        time: '15:07',
      },
      {
        id: 'm9',
        from: 'them',
        text: 'Yes, I can start on Monday and share first drafts by Wednesday.',
        time: '15:07',
      },
      {
        id: 'm10',
        from: 'me',
        text: 'Hi Sara, I like your portfolio. Are you available next week?',
        time: '15:02',
      },
      {
        id: 'm11',
        from: 'them',
        text: 'Yes, I can start on Monday and share first drafts by Wednesday.',
        time: '15:07',
      },
      {
        id: 'm12',
        from: 'them',
        text: 'Yes,i will share first drafts by Wednesday.',
        time: '15:07',
      },
    ],
  },
];

export function getThreadById(id) {
  return messageThreads.find((thread) => thread.id === id);
}
