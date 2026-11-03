import { useState, type SubmitEvent } from "react";

type TodoFormProps = {
    onAdd: (description: string) => Promise<void>;
};

export default function TodoForm({ onAdd }: TodoFormProps) {
    const [description, setDescription] = useState("");

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!description.trim()) return;

        onAdd(description.trim()).then(() => {
            setDescription("");
        });
    }

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <label htmlFor="description">What would you like to do?</label>

            <div className="form-row">
                <input
                    id="description"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    placeholder="For example: Finishing a React project"
                    required
                />

                <button className="primary-button" type="submit">
                    + Task
                </button>
            </div>
        </form>
    );
}