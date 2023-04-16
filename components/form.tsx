import React, { useState } from 'react';
import { Todo } from '../helpers/types';

type TodoFormProps = {
  todo: Todo,
  onChange: (todo: Todo) => void;
};

export const TodoForm = ({ todo, onChange }: TodoFormProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    onChange({
      ...todo,
      [name]: name == 'remind' ? parseInt(value) : value
    });
  };

  return (
    <>
      <form>
        <label>
          Title:
          <input type="text" name="title" value={todo.title} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Deadline:
          <input type="date" name="deadline" value={todo.deadline} onChange={handleChange} />
        </label>
        <br />

        <div className="flex">
          <label>
            Start Time:
            <input type="time" name="startTime" value={todo.startTime} onChange={handleChange} />
          </label>
          <br />
          <label>
            End Time:
            <input type="time" name="endTime" value={todo.endTime} onChange={handleChange} />
          </label>
          <br />
        </div>

        <label>
          Remind:
          <select name="remind" value={todo.remind} onChange={handleChange}>
            {[5, 10, 15, 20, 25, 30].map(n => <option value={n}>{n} minutes before</option>)}
          </select>
        </label>
        <br />
        <label>
          Repeat:
          <select name="repeat" value={todo.remind} onChange={handleChange}>
            {['Daily', 'Weekly', 'Monthly'].map(n => <option value={n}>{n}</option>)}
          </select>
        </label>
        <br />
      </form>
    </>
  );
};

export default TodoForm;
