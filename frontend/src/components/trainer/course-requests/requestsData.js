export const stats = [
  {
    title: "New Requests",
    value: 8,
    color: "text-[#3046D3]",
  },
  {
    title: "Accepted",
    value: 5,
    color: "text-green-600",
  },
  {
    title: "In Development",
    value: 4,
    color: "text-orange-500",
  },
  {
    title: "Completed",
    value: 15,
    color: "text-gray-800",
  },
];

export const requests = [
  {
    id: 1,
    title: "Cyber Security Awareness",
    priority: "High",
    priorityColor: "bg-red-100 text-red-600",
    status: "New Request",
    statusColor: "bg-blue-100 text-blue-700",
    requester: "HR Department",
    type: "General Training",
    date: "Oct 24, 2023",
    progress: 0,
  },
  {
    id: 2,
    title: "Cloud Security Fundamentals",
    priority: "Medium",
    priorityColor: "bg-yellow-100 text-yellow-700",
    status: "Accepted",
    statusColor: "bg-green-100 text-green-700",
    requester: "IT Manager",
    type: "Department Training",
    date: "Oct 21, 2023",
    progress: 15,
  },
  {
    id: 3,
    title: "Advanced Data Privacy",
    priority: "Medium",
    priorityColor: "bg-gray-100 text-gray-700",
    status: "In Development",
    statusColor: "bg-indigo-100 text-indigo-700",
    requester: "HR Department",
    type: "General Training",
    date: "Oct 18, 2023",
    progress: 45,
  },
];

export const selectedRequest = {
  id: "RQ-8821",
  title: "Cyber Security Awareness",
  objective:
    "Improve employee awareness of cybersecurity threats, phishing attacks, password management, and safe online practices.",
  audience: [
    "All Employees",
    "New Hires",
    "Contractors",
  ],
  outcomes: [
    "Recognize phishing attempts.",
    "Use strong passwords.",
    "Understand MFA.",
    "Follow company security policies.",
  ],
};