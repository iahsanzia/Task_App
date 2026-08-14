export interface Task {
  id: number;
  title: string;
  note: string | null;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
