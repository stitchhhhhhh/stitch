const managerDashboardData = {
  IT: {
    title: "Information Technology Department Overview",
    description:
      "Monitor training performance and employee progress within your department.",

    exportButton: "Export Department Report",
    assignButton: "Assign Training",

    stats: [
      {
        title: "DEPT COMPLETION RATE",
        value: "82%",
        subtitle: "+2.4%",
        progress: 82,
      },
      {
        title: "EMPLOYEES COMPLETED",
        value: "42/50",
        subtitle: "8 employees remaining",
      },
      {
        title: "ACTIVE PROGRAMS",
        value: "8",
        subtitle: "3 programs ending soon",
      },
      {
        title: "AVG DEPARTMENT SCORE",
        value: "88%",
        subtitle: "★★★★★",
      },
    ],

    deadlines: [
      {
        title: "Cyber Security Awareness",
        days: "2 days left",
        progress: "88% Completed",
        color: "red",
      },
      {
        title: "Cloud Security Fundamentals",
        days: "5 days left",
        progress: "45% Completed",
        color: "yellow",
      },
      {
        title: "Data Privacy Compliance",
        days: "12 days left",
        progress: "12% Completed",
        color: "blue",
      },
    ],

    performance: [
      {
        course: "Cyber Security Awareness",
        value: 95,
      },
      {
        course: "Data Privacy",
        value: 84,
      },
      {
        course: "Cloud Infrastructure",
        value: 78,
      },
      {
        course: "Network Security",
        value: 62,
      },
    ],

    activities: [
      {
        name: "John Smith",
        action: "completed",
        course: "Cyber Security Awareness",
        time: "2 hours ago",
      },
      {
        name: "Sarah Johnson",
        action: "enrolled in",
        course: "Cloud Security",
        time: "4 hours ago",
      },
      {
        name: "Michael Chen",
        action: "passed",
        course: "Network Security",
        time: "Yesterday",
      },
      {
        name: "Emily Wong",
        action: "completed",
        course: "Data Privacy",
        time: "Yesterday",
      },
    ],

    performersTitle: "IT Top Performers",

    performers: [
      {
        name: "John Smith",
        role: "Senior Developer",
        score: "98.5",
      },
      {
        name: "Sarah Johnson",
        role: "Systems Architect",
        score: "97.2",
      },
      {
        name: "Michael Chen",
        role: "Cloud Engineer",
        score: "96.8",
      },
    ],
  },

  Finance: {
    title: "Finance Department Overview",

    description:
      "Monitor training performance and employee progress within your department.",

    exportButton: "Export Finance Report",

    assignButton: "Assign Training",

    stats: [
      {
        title: "DEPT COMPLETION RATE",
        value: "74%",
        subtitle: "+1.2%",
        progress: 74,
      },
      {
        title: "EMPLOYEES COMPLETED",
        value: "31/42",
        subtitle: "11 employees remaining",
      },
      {
        title: "ACTIVE PROGRAMS",
        value: "6",
        subtitle: "2 programs ending soon",
      },
      {
        title: "AVG DEPARTMENT SCORE",
        value: "85%",
        subtitle: "★★★★☆",
      },
    ],

    deadlines: [
      {
        title: "Annual Financial Audit Prep",
        days: "3 days left",
        progress: "90% Completed",
        color: "red",
      },
      {
        title: "Global Tax Compliance",
        days: "6 days left",
        progress: "40% Completed",
        color: "yellow",
      },
      {
        title: "Corporate Risk Management",
        days: "10 days left",
        progress: "15% Completed",
        color: "blue",
      },
    ],

    performance: [
      {
        course: "Financial Forecasting",
        value: 88,
      },
      {
        course: "Internal Audit Procedures",
        value: 72,
      },
      {
        course: "Tax Law Updates",
        value: 65,
      },
      {
        course: "Risk Assessment 101",
        value: 92,
      },
    ],

    activities: [
      {
        name: "Sarah Thompson",
        action: "completed",
        course: "Financial Forecasting",
        time: "2 hours ago",
      },
      {
        name: "David Miller",
        action: "enrolled in",
        course: "Tax Law Updates",
        time: "4 hours ago",
      },
      {
        name: "Robert Chen",
        action: "passed",
        course: "Corporate Risk Management",
        time: "Yesterday",
      },
      {
        name: "Linda Wu",
        action: "completed",
        course: "Annual Financial Audit Prep",
        time: "Yesterday",
      },
    ],

    performersTitle: "Finance Top Performers",

    performers: [
      {
        name: "Sarah Thompson",
        role: "Senior Accountant",
        score: "98.2",
      },
      {
        name: "David Miller",
        role: "Financial Analyst",
        score: "96.5",
      },
      {
        name: "Robert Chen",
        role: "Tax Specialist",
        score: "95.8",
      },
    ],
  },
};

export default managerDashboardData;