export interface Task {
    title: string;
    description: string;
    category: string;
    date: string;
    completed: boolean;
    id?: string;
}