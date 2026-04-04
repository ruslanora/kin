export type CalendarCellType = {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
};

export type CalendarInterviewType = {
  id: number;
  jobId: number;
  round: string | null;
  note: string | null;
  scheduledAt: Date;
  jobTitle: string | null;
  companyName: string;
  isFollowUp: boolean;
};
