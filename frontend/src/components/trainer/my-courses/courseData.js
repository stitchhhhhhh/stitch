export const stats = [
  {
    title: "Draft Courses",
    value: 4,
    color: "text-[#3046D3]",
    icon: "📝",
  },
  {
    title: "In Development",
    value: 6,
    color: "text-orange-500",
    icon: "⚙️",
  },
  {
    title: "Pending Review",
    value: 2,
    color: "text-yellow-500",
    icon: "📋",
  },
  {
    title: "Published Courses",
    value: 12,
    color: "text-green-600",
    icon: "✅",
  },
];

export const courses = [
  {
    id: 1,
    title: "Cloud Security Fundamentals",
    department: "IT Department",
    trainingType: "Department Training",
    status: "In Development",
    progress: 65,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    updated: "Updated 2 days ago",
    primaryButton: "Edit Course",
    secondaryButton: "Details",
    badgeColor: "bg-blue-100 text-blue-700",
  },

  {
    id: 2,
    title: "Cyber Security Awareness",
    department: "HR",
    trainingType: "General Training",
    status: "Submitted",
    progress: 100,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
    updated: "Updated Yesterday",
    primaryButton: "View Submission",
    secondaryButton: "",
    badgeColor: "bg-gray-200 text-gray-700",
  },

  {
    id: 3,
    title: "Data Privacy Ethics",
    department: "IT Dept Manager",
    trainingType: "Department Training",
    status: "Revision Required",
    progress: 35,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    updated: "Reviewer Feedback Available",
    primaryButton: "Revise Course",
    secondaryButton: "",
    badgeColor: "bg-red-100 text-red-600",
  },

  {
    id: 4,
    title: "Leadership Essentials",
    department: "Assigned by HR",
    trainingType: "General Training",
    status: "Published",
    progress: 100,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    updated: "Published",
    primaryButton: "View Course",
    secondaryButton: "",
    badgeColor: "bg-green-100 text-green-600",
  },
];

export const recentActivities = [
  {
    title: "Cloud Security submitted",
    time: "2 hours ago",
  },
  {
    title: "Data Privacy revision requested",
    time: "Yesterday",
  },
  {
    title: "Cyber Security published",
    time: "2 days ago",
  },
];