const periods = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const mockEarningsData = {
  weekly: {
    total: 1250.0,
    percentageChange: 15.2,
    chartData: [
      { period: "Week 1", earnings: 280 },
      { period: "Week 2", earnings: 320 },
      { period: "Week 3", earnings: 290 },
      { period: "Week 4", earnings: 350 },
      { period: "Week 5", earnings: 310 },
      { period: "Week 6", earnings: 380 },
      { period: "Week 7", earnings: 420 },
      { period: "Week 8", earnings: 390 },
      { period: "Week 9", earnings: 450 },
      { period: "Week 10", earnings: 480 },
      { period: "Week 11", earnings: 520 },
      { period: "Week 12", earnings: 550 },
    ],
    tableData: [
      {
        date: "2025-01-10",
        description: "Spanish Conversation - Individual Lesson",
        amount: 45.0,
        status: "completed",
      },
      {
        date: "2025-01-09",
        description: "French Grammar Workshop",
        amount: 75.0,
        status: "pending",
      },
      {
        date: "2025-01-08",
        description: "English Speaking Assessment",
        amount: 60.0,
        status: "pending",
      },
      {
        date: "2025-01-07",
        description: "German Beginner Group Class",
        amount: 35.0,
        status: "completed",
      },
      {
        date: "2025-01-06",
        description: "Italian Pronunciation - Individual",
        amount: 50.0,
        status: "processing",
      },
      {
        date: "2025-01-05",
        description: "Mandarin Writing Workshop",
        amount: 80.0,
        status: "completed",
      },
      {
        date: "2025-01-04",
        description: "Portuguese Conversation Group",
        amount: 40.0,
        status: "processing",
      },
      {
        date: "2025-01-03",
        description: "Japanese Cultural Context Lesson",
        amount: 65.0,
        status: "completed",
      },
    ],
    invoiceData: [
      {
        invoiceId: "NV-2024-001",
        date: "2024-08-01T10:30:00Z",
        amount: 45.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-002",
        date: "2024-08-05T14:20:00Z",
        amount: 120.5,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-003",
        date: "2024-08-12T09:15:00Z",
        amount: 75.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-004",
        date: "2024-08-18T11:45:00Z",
        amount: 200.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-005",
        date: "2024-08-25T08:30:00Z",
        amount: 150.25,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-006",
        date: "2024-09-01T13:00:00Z",
        amount: 89.99,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-007",
        date: "2024-09-07T16:40:00Z",
        amount: 310.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-008",
        date: "2024-09-12T10:10:00Z",
        amount: 55.5,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-009",
        date: "2024-09-18T15:25:00Z",
        amount: 260.75,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-010",
        date: "2024-09-22T09:50:00Z",
        amount: 99.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-011",
        date: "2024-09-28T12:00:00Z",
        amount: 185.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-012",
        date: "2024-10-01T17:30:00Z",
        amount: 45.5,
        status: "Paid",
      },
    ],
  },
  monthly: {
    total: 4850.0,
    percentageChange: 22.8,
    chartData: [
      { period: "Jan 2024", earnings: 3200 },
      { period: "Feb 2024", earnings: 3450 },
      { period: "Mar 2024", earnings: 3800 },
      { period: "Apr 2024", earnings: 4100 },
      { period: "May 2024", earnings: 3950 },
      { period: "Jun 2024", earnings: 4300 },
      { period: "Jul 2024", earnings: 4650 },
      { period: "Aug 2024", earnings: 4200 },
      { period: "Sep 2024", earnings: 4500 },
      { period: "Oct 2024", earnings: 4750 },
      { period: "Nov 2024", earnings: 4900 },
      { period: "Dec 2024", earnings: 4850 },
    ],
    tableData: [
      {
        date: "2025-01-10",
        description: "Spanish Conversation - Individual Lesson",
        amount: 45.0,
        status: "completed",
      },
      {
        date: "2025-01-09",
        description: "French Grammar Workshop (5 students)",
        amount: 125.0,
        status: "pending",
      },
      {
        date: "2025-01-08",
        description: "English Speaking Assessment",
        amount: 60.0,
        status: "pending",
      },
      {
        date: "2025-01-07",
        description: "German Beginner Group Class (8 students)",
        amount: 160.0,
        status: "completed",
      },
      {
        date: "2025-01-06",
        description: "Italian Pronunciation - Individual",
        amount: 50.0,
        status: "processing",
      },
      {
        date: "2025-01-05",
        description: "Mandarin Writing Workshop (6 students)",
        amount: 180.0,
        status: "completed",
      },
      {
        date: "2025-01-04",
        description: "Portuguese Conversation Group (4 students)",
        amount: 80.0,
        status: "processing",
      },
      {
        date: "2025-01-03",
        description: "Japanese Cultural Context Lesson",
        amount: 65.0,
        status: "completed",
      },
      {
        date: "2025-01-02",
        description: "Russian Grammar - Individual Session",
        amount: 55.0,
        status: "completed",
      },
      {
        date: "2025-01-01",
        description: "Arabic Beginner Assessment",
        amount: 70.0,
        status: "pending",
      },
    ],
    invoiceData: [
      {
        invoiceId: "NV-2024-001",
        date: "2024-08-01T10:30:00Z",
        amount: 45.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-002",
        date: "2024-08-05T14:20:00Z",
        amount: 120.5,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-003",
        date: "2024-08-12T09:15:00Z",
        amount: 75.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-004",
        date: "2024-08-18T11:45:00Z",
        amount: 200.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-005",
        date: "2024-08-25T08:30:00Z",
        amount: 150.25,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-006",
        date: "2024-09-01T13:00:00Z",
        amount: 89.99,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-007",
        date: "2024-09-07T16:40:00Z",
        amount: 310.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-008",
        date: "2024-09-12T10:10:00Z",
        amount: 55.5,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-009",
        date: "2024-09-18T15:25:00Z",
        amount: 260.75,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-010",
        date: "2024-09-22T09:50:00Z",
        amount: 99.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-011",
        date: "2024-09-28T12:00:00Z",
        amount: 185.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-012",
        date: "2024-10-01T17:30:00Z",
        amount: 45.5,
        status: "Paid",
      },
    ],
  },
  yearly: {
    total: 52400.0,
    percentageChange: 18.5,
    chartData: [
      { period: "2020", earnings: 28500 },
      { period: "2021", earnings: 35200 },
      { period: "2022", earnings: 42800 },
      { period: "2023", earnings: 48600 },
      { period: "2024", earnings: 52400 },
    ],
    tableData: [
      {
        date: "2025-01-10",
        description: "Spanish Conversation - Individual Lesson",
        amount: 45.0,
        status: "completed",
      },
      {
        date: "2025-01-09",
        description: "French Grammar Workshop (5 students)",
        amount: 125.0,
        status: "pending",
      },
      {
        date: "2025-01-08",
        description: "English Speaking Assessment",
        amount: 60.0,
        status: "pending",
      },
      {
        date: "2025-01-07",
        description: "German Beginner Group Class (8 students)",
        amount: 160.0,
        status: "completed",
      },
      {
        date: "2025-01-06",
        description: "Italian Pronunciation - Individual",
        amount: 50.0,
        status: "processing",
      },
      {
        date: "2025-01-05",
        description: "Mandarin Writing Workshop (6 students)",
        amount: 180.0,
        status: "completed",
      },
      {
        date: "2025-01-04",
        description: "Portuguese Conversation Group (4 students)",
        amount: 80.0,
        status: "processing",
      },
      {
        date: "2025-01-03",
        description: "Japanese Cultural Context Lesson",
        amount: 65.0,
        status: "completed",
      },
      {
        date: "2025-01-02",
        description: "Russian Grammar - Individual Session",
        amount: 55.0,
        status: "completed",
      },
      {
        date: "2025-01-01",
        description: "Arabic Beginner Assessment",
        amount: 70.0,
        status: "pending",
      },
      {
        date: "2024-12-30",
        description: "Korean Conversation Practice",
        amount: 40.0,
        status: "completed",
      },
      {
        date: "2024-12-29",
        description: "Hindi Writing Workshop",
        amount: 85.0,
        status: "processing",
      },
    ],
    invoiceData: [
      {
        invoiceId: "NV-2024-001",
        date: "2024-08-01T10:30:00Z",
        amount: 45.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-002",
        date: "2024-08-05T14:20:00Z",
        amount: 120.5,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-003",
        date: "2024-08-12T09:15:00Z",
        amount: 75.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-004",
        date: "2024-08-18T11:45:00Z",
        amount: 200.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-005",
        date: "2024-08-25T08:30:00Z",
        amount: 150.25,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-006",
        date: "2024-09-01T13:00:00Z",
        amount: 89.99,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-007",
        date: "2024-09-07T16:40:00Z",
        amount: 310.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-008",
        date: "2024-09-12T10:10:00Z",
        amount: 55.5,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-009",
        date: "2024-09-18T15:25:00Z",
        amount: 260.75,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-010",
        date: "2024-09-22T09:50:00Z",
        amount: 99.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-011",
        date: "2024-09-28T12:00:00Z",
        amount: 185.0,
        status: "Paid",
      },
      {
        invoiceId: "NV-2024-012",
        date: "2024-10-01T17:30:00Z",
        amount: 45.5,
        status: "Paid",
      },
    ],
  },
};

const mockEarningHeaderData = [
  {
    period: "weekly",
    total: 1250.0,
    percentageChange: 15.2,
  },
  {
    period: "monthly",
    total: 4850.0,
    percentageChange: 22.8,
  },
  {
    period: "yearly",
    total: 52400.0,
    percentageChange: 18.5,
  },
];

const lessonTypeOptions = [
  { value: "all", label: "All Lesson Types" },
  { value: "1-on-1", label: "Individual Lessons" },
  { value: "group", label: "Group Lessons" },
];

const paymentStatusOptions = [
  { value: "all", label: "All Payments" },
  { value: "SENT", label: "Sent" },
  { value: "PENDING", label: "Pending" },
  { value: "SETTLED", label: "Settled" },
];

const amountRangeOptions = [
  { value: "all", label: "All Amounts" },
  { value: "0-50", label: "$0 - $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100-200", label: "$100 - $200" },
  { value: "200-+", label: "$200+" },
];

const itemsPerPage = 10;

export {
  periods,
  mockEarningsData,
  mockEarningHeaderData,
  lessonTypeOptions,
  paymentStatusOptions,
  amountRangeOptions,
  itemsPerPage,
};
