export const stats = [
  {
    title: "Waiting for Trainer",
    value: "08",
    subtitle: "Approved but not started",
    color: "bg-indigo-100",
  },
  {
    title: "In Development",
    value: "12",
    subtitle: "Currently being built",
    color: "bg-blue-100",
  },
  {
    title: "Pending Review",
    value: "03",
    subtitle: "Requires manager approval",
    color: "bg-red-100",
  },
  {
    title: "Published Programs",
    value: "45",
    subtitle: "Total live IT courses",
    color: "bg-indigo-100",
  },
];

export const courses = [
  {
    status: "SUBMITTED FOR REVIEW",
    title: "Cloud Security Awareness",
    trainer: "John Smith",
    date: "Submitted Oct 24, 2023",
    action1: "Review Course",
    action2: "View Course",
    action3: "Request Revision",
    progress: null,
    border: "border-red-300",
  },

  {
    status: "READY TO PUBLISH",
    title: "Data Privacy Compliance",
    trainer: "Sarah Johnson",
    date: "Approved Oct 20, 2023",
    action1: "Publish Training",
    action2: "Set Deadline",
    progress: null,
    border: "border-blue-300",
  },

  {
    status: "PUBLISHED",
    title: "Network Security Fundamentals",
    trainer: "",
    date: "",
    action1: "View Analytics",
    action2: "Manage Enrollment",
    progress: 82,
    border: "border-gray-300",
  },

  {
    status: "IN DEVELOPMENT",
    title: "Advanced AWS Architecture",
    trainer: "Michael Chen",
    date: "Est. Completion Nov 12",
    action1: "",
    action2: "",
    progress: 45,
    border: "border-gray-300",
  },
];

export const deadlines = [
  {
    month: "OCT",
    day: "28",
    title: "Phishing Simulation Q4",
    subtitle: "Deadline approaching",
  },
  {
    month: "NOV",
    day: "05",
    title: "DevSecOps Masterclass",
    subtitle: "Milestone: Module 4 build",
  },
  {
    month: "DEC",
    day: "15",
    title: "Network Security Fundamentals",
    subtitle: "Final certification date",
  },
];

export const activities = [
  {
    text: "John Smith submitted Cloud Security Awareness for review.",
    time: "2 hours ago",
  },
  {
    text: "New program published: AI for Developers.",
    time: "5 hours ago",
  },
  {
    text: "45 employees assigned to Data Privacy Compliance.",
    time: "Yesterday",
  },
  {
    text: "Revision requested for Incident Response 2.0.",
    time: "2 days ago",
  },
];