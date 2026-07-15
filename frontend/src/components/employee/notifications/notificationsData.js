export const filters = [
  "All",
  "Course Assignments",
  "Deadlines",
  "Certificates",
  "Assessments",
];

export const notifications = [
  {
    id: 1,
    type: "course",
    icon: "🎓",
    title: "New Course Assigned: Cybersecurity Essentials",
    description:
      "You have been enrolled in a new mandatory training module. This course covers vital data protection protocols and phishing awareness.",
    time: "2 hours ago",
    unread: true,
    actions: [
      "Go To Course",
      "Dismiss",
    ],
  },

  {
    id: 2,
    type: "deadline",
    icon: "📅",
    title: "Upcoming Deadline: Q3 Compliance Quiz",
    description:
      "Your quarterly compliance assessment is due in 48 hours. Please ensure you have completed all relevant reading materials.",
    time: "5 hours ago",
    unread: true,
    actions: [
      "Start Assessment",
    ],
  },

  {
    id: 3,
    type: "certificate",
    icon: "🏆",
    title: "Certificate Issued: Advanced Project Management",
    description:
      "Congratulations! You have successfully completed the Advanced Project Management track and earned your digital certificate.",
    time: "Yesterday",
    unread: false,
    actions: [
      "View Certificate",
    ],
  },

  {
    id: 4,
    type: "certificate",
    icon: "🏆",
    title: "Certificate Issued: Advanced Project Management",
    description:
      "Congratulations! You have successfully completed the Advanced Project Management track and earned your digital certificate.",
    time: "2 days ago",
    unread: false,
    actions: [
      "View Certificate",
    ],
  },
];