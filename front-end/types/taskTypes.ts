export interface Task {
  id: number;
  title: string;
  note: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
