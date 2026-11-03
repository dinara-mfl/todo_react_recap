export type TodoStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export type Todo = {
    id: string;
    description: string;
    status: TodoStatus;
};

export type TodoDto = {
    description: string;
    status: TodoStatus;
};