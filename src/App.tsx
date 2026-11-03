import { useEffect, useState } from "react";
import axios from "axios";
import TodoForm from "./components/TodoForm";
import TodoCard from "./components/TodoCard";
import type { Todo, TodoDto, TodoStatus } from "./types/Todo";

const columns: { status: TodoStatus; title: string }[] = [
    { status: "OPEN", title: "Open" },
    { status: "IN_PROGRESS", title: "In progress" },
    { status: "DONE", title: "Done" },
];

export default function App() {
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        axios.get<Todo[]>("/api/todo").then(response => {
            setTodos(response.data);
        });
    }, []);

    function addTodo(description: string): Promise<void> {
        const data: TodoDto = {
            description,
            status: "OPEN",
        };

        return axios.post<Todo>("/api/todo", data).then(response => {
            setTodos(current => [...current, response.data]);
        });
    }

    function updateTodo(id: string, data: TodoDto): Promise<void> {
        return axios.put<Todo>(`/api/todo/${id}`, data).then(response => {
            setTodos(current =>
                current.map(todo => (todo.id === id ? response.data : todo)),
            );
        });
    }

    function deleteTodo(id: string): Promise<void> {
        return axios.delete(`/api/todo/${id}`).then(() => {
            setTodos(current => current.filter(todo => todo.id !== id));
        });
    }

    const doneCount = todos.filter(todo => todo.status === "DONE").length;

    return (
        <div className="app">
            <header className="page-header">
                <div>
                    <h1>TODO</h1>
                    <p className="subtitle">Dashboard</p>
                </div>

                <div className="progress-pill">
                    {doneCount} of {todos.length} completed
                </div>
            </header>

            <main>
                <TodoForm onAdd={addTodo} />

                <div className="board">
                    {columns.map(column => {
                        const columnTodos = todos.filter(
                            todo => todo.status === column.status,);

                        return (
                            <section
                                className={`column column-${column.status.toLowerCase()}`}
                                key={column.status}
                            >
                                <div className="column-heading">
                                    <h2>{column.title}</h2>
                                    <span className="count">{columnTodos.length}</span>
                                </div>

                                <div className="card-list">
                                    {columnTodos.map(todo => (
                                        <TodoCard
                                            key={todo.id}
                                            todo={todo}
                                            onUpdate={updateTodo}
                                            onDelete={deleteTodo}
                                        />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}