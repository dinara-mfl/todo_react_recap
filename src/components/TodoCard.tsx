import { useState, type SubmitEvent } from "react";
import type { Todo, TodoDto, TodoStatus } from "../types/Todo";

type TodoCardProps = {
    todo: Todo;
    onUpdate: (id: string, data: TodoDto) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
};

export default function TodoCard({todo, onUpdate, onDelete}: TodoCardProps) {
    const [editing, setEditing] = useState(false);
    const [description, setDescription] = useState(todo.description);

    function handleSave(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!description.trim()) return;

        onUpdate(todo.id, {
            description: description.trim(),
            status: todo.status,
        }).then(() => {
            setEditing(false);
        });
    }

    function handleStatusChange(status: TodoStatus) {
        onUpdate(todo.id, {
            description: todo.description,
            status,
        });
    }

    return (
        <article className="todo-card">
            {editing ? (
                <form onSubmit={handleSave}>
                    <label htmlFor={`edit-${todo.id}`}>Description</label>

                    <textarea
                        id={`edit-${todo.id}`}
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                        required
                    />

                    <div className="card-actions">
                        <button type="submit">Save</button>

                        <button type="button" onClick={() => setEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <p className="todo-description">{todo.description}</p>

                    <select
                        aria-label="Task status"
                        value={todo.status}
                        onChange={event =>
                            handleStatusChange(event.target.value as TodoStatus)
                        }
                    >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="DONE">Done</option>
                    </select>

                    <div className="card-actions">
                        <button
                            type="button"
                            onClick={() => {
                                setDescription(todo.description);
                                setEditing(true);
                            }}
                        >
                            Edit
                        </button>

                        <button
                            className="delete-button"
                            type="button"
                            onClick={() => onDelete(todo.id)}
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </article>
    );
}