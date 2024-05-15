import {
  FaPen,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
} from "react-icons/fa";
import { useState, useEffect, useRef, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: Date.now(),
          text: action.payload,
          completed: false,
        },
      ];
    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case "COMPLETE_TODO":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: true } : todo
      );
    case "UNCOMPLETE_TODO":
      return state.map((todo) =>
        todo.id === action.payload ? { ...todo, completed: false } : todo
      );
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "MOVE_TODO_UP":
      const index = state.findIndex((item) => item.id === action.payload);
      if (index === -1 || index === 0 || state.length <= 1) {
        // If the item is not found, already at the top, or the array is empty, return the array unchanged
        return state;
      }
      return state.map((item, i) => {
        if (i === index - 1) return state[index]; // Move the item up
        if (i === index) return state[index - 1]; // Place the previous item in the current position
        return item;
      });

    case "MOVE_TODO_DOWN":
      return state.map((todo, index, todos) => {
        if (todo.id === action.payload && index < todos.length - 1) {
          return ([todos[index + 1], todos[index]] = [
            todos[index],
            todos[index + 1],
          ]);
        }
        return todo;
      });
    case "EDIT_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo
      );
    default:
      return state;
  }
}

const convertDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function ToDo() {
  const initialData = JSON.parse(localStorage.getItem("todos")) || [];

  const [todos, dispatch] = useReducer(reducer, initialData);
  const [newTodo, setNewTodo] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleSubmit(e) {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    dispatch({ type: "ADD_TODO", payload: newTodo });
    setNewTodo("");
  }

  return (
    <div className="todo">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            ref={inputRef}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="NEW TODO"
          />
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="todo-wrapper">
        <ul className="flex gap-10 todo-list">
          {todos.map((todo, ind) => (
            <li key={ind}>
              <div className="flex todo-item flex-column">
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.text}
                </span>
                <div className="btn-container">
                  <span className="date-value">{convertDate(todo.id)}</span>
                  <button
                    onClick={() =>
                      dispatch({ type: "TOGGLE_TODO", payload: todo.id })
                    }
                  >
                    <FaCheckCircle />
                  </button>
                  <button
                    onClick={() =>
                      dispatch({ type: "MOVE_TODO_UP", payload: todo.id })
                    }
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    onClick={() =>
                      dispatch({ type: "MOVE_TODO_DOWN", payload: todo.id })
                    }
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    onClick={() =>
                      dispatch({ type: "EDIT_TODO", payload: todo.id })
                    }
                  >
                    <FaPen />
                  </button>
                  <button
                    onClick={() =>
                      dispatch({ type: "DELETE_TODO", payload: todo.id })
                    }
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDo;
