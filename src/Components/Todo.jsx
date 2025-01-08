import React, { useReducer, useState, useEffect } from 'react';
import axios from 'axios';

const Todo = () => {
    const initialState = [];
    const reducer = (state, action) => {
        switch (action.type) {
            case 'SET_TODOS':
                return action.payload;
            case 'ADD_TODO':
                return [...state, action.payload];
            case 'EDIT_TODO':
                return state.map((todo) =>
                    todo.id === action.payload.id
                        ? action.payload
                        : todo
                );
            case 'DELETE_TODO': return state.filter((todo) => todo.id !== action.payload)

            default:
                return state;
        }
    };

    const [todo, dispatch] = useReducer(reducer, initialState);
    const [input, setInput] = useState({ name: '', email: '' });
    const [edit, setEdit] = useState(null);

    const fetchTodos = () => {
        axios.get('http://localhost:8000/todo')
            .then((response) => {
                dispatch({ type: 'SET_TODOS', payload: response.data });
            })
            .catch((error) => console.error('Error fetching todos:', error));
    };

    const editandupdatetodo = () => {
        if (input.name.trim() === '' || input.email.trim() === '') {
            alert('Fields cannot be blank');
            return;
        }

        const todoData = { name: input.name, email: input.email };

        if (edit) {
            axios.put(`http://localhost:8000/todo/${edit}`, todoData)
                .then(() => {
                    dispatch({ type: 'EDIT_TODO', payload: { ...todoData, id: edit } });
                    setEdit(null);
                    setInput({ name: '', email: '' });
                })
                .catch((error) => console.error('Error updating todo:', error));
        } else {
            axios.post('http://localhost:8000/todo', todoData)
                .then((response) => {
                    dispatch({ type: 'ADD_TODO', payload: response.data });
                    setInput({ name: '', email: '' });
                })
                .catch((error) => console.error('Error adding todo:', error));
        }
    };

    const editData = (item) => {
        setInput({ name: item.name, email: item.email });
        setEdit(item.id);
    };


    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div>
            <h1>Todo App</h1>
            <div className="bg-info p-3 w-50 mx-auto rounded-3">
                <div>
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Enter Name"
                        value={input.name}
                        onChange={(e) => setInput({ ...input, name: e.target.value })}
                    />
                    <input
                        type="email"
                        className="form-control mb-3"
                        placeholder="Enter Email"
                        value={input.email}
                        onChange={(e) => setInput({ ...input, email: e.target.value })}
                    />
                </div>
                <button className="btn btn-success" onClick={editandupdatetodo}>
                    {edit ? 'Update' : 'Add'}
                </button>
            </div>
            <div className="w-50 mx-auto mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todo.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>
                                    <button
                                        className='btn btn-primary me-2'
                                        onClick={() => editData(item)}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button className='btn btn-danger me-5' onClick={() => dispatch({ type: 'DELETE_TODO', payload: item.id })}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Todo;
