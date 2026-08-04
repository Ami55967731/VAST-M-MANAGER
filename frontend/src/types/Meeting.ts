export interface Meeting {
  id: number;
  title: string;
  description: string;
  location: string;
  timezone: string;
  date: string;
  time: string;
  duration: string;
  active?: boolean;
  completed: boolean;
}