export const stats = [
  {
    title: "Pending Requests",
    value: 12,
    color: "blue",
  },
  {
    title: "Draft Courses",
    value: 5,
    color: "gray",
  },
  {
    title: "Pending Review",
    value: 3,
    color: "red",
  },
  {
    title: "Published Courses",
    value: 28,
    color: "primary",
  },
];

export const requests = [
  {
    id: 1,
    course: "Cyber Security Awareness",
    requester: "HR Department",
    priority: "High",
    date: "Today",
  },
  {
    id: 2,
    course: "Cloud Security Fundamentals",
    requester: "IT Department",
    priority: "Medium",
    date: "Yesterday",
  },
  {
    id: 3,
    course: "Data Privacy Essentials",
    requester: "Finance Department",
    priority: "Low",
    date: "2 days ago",
  },
];

export const pipeline = [
  {
    title: "Cloud Security",
    progress: 65,
    status: "In Development",
    color: "bg-blue-600",
    note: "Estimated 4 days remaining",
  },
  {
    title: "Data Privacy",
    progress: 100,
    status: "Under Review",
    color: "bg-gray-600",
    note: "Waiting for HR approval",
  },
  {
    title: "Network Security",
    progress: 72,
    status: "Revision",
    color: "bg-red-400",
    note: "Needs improvement",
  },
];

export const materials = [
  {
    id: 1,
    file: "CyberSecurity_Guide.pdf",
    time: "2 hours ago",
    type: "pdf",
  },
  {
    id: 2,
    file: "CloudTraining.mp4",
    time: "Yesterday",
    type: "video",
  },
  {
    id: 3,
    file: "LeadershipWorkshop.pptx",
    time: "3 days ago",
    type: "ppt",
  },
];

export const activities = [
  {
    id: 1,
    title: "Cloud Security course approved.",
    time: "10 minutes ago",
    type: "success",
  },
  {
    id: 2,
    title: "Data Privacy course requires revision.",
    time: "2 hours ago",
    type: "warning",
  },
  {
    id: 3,
    title: "Cyber Security course published.",
    time: "Yesterday",
    type: "publish",
  },
];