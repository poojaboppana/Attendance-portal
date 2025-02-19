import React, { useState, useEffect } from 'react';
import './Admin.css';

function Admin() {
    const [rollNumber, setRollNumber] = useState('');
    const [rollNumbers, setRollNumbers] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        const savedRollNumbers = JSON.parse(localStorage.getItem('rollNumbers'));
        if (savedRollNumbers) {
            setRollNumbers(savedRollNumbers);
        }
    }, []);

    const handleAddRollNumber = (e) => {
        e.preventDefault();
        const trimmedRollNumber = rollNumber.trim().toLowerCase();

        if (trimmedRollNumber) {
            if (rollNumbers.some(roll => roll.toLowerCase() === trimmedRollNumber)) {
                alert('This roll number already exists. Please enter a different one.');
                return;
            }

            if (editIndex !== null) {
                const updatedRollNumbers = rollNumbers.map((roll, index) =>
                    index === editIndex ? trimmedRollNumber : roll
                );
                setRollNumbers(updatedRollNumbers);
                setEditIndex(null);
            } else {
                setRollNumbers([...rollNumbers, trimmedRollNumber]);
            }
            setRollNumber('');
        }
    };

    const handleEditRollNumber = (index) => {
        setRollNumber(rollNumbers[index]);
        setEditIndex(index);
    };

    const handleRemoveRollNumber = (index) => {
        const updatedRollNumbers = rollNumbers.filter((_, i) => i !== index);
        setRollNumbers(updatedRollNumbers);
    };

    const handleSubmit = () => {
        localStorage.setItem('rollNumbers', JSON.stringify(rollNumbers));
        alert('Roll numbers have been saved!');
    };

    return (
        <div className="admin">
            <h2>Admin Panel</h2>
            <form onSubmit={handleAddRollNumber}>
                <input
                    type="text"
                    placeholder="Enter Roll Number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                />
                <button type="submit">{editIndex !== null ? 'Update Roll Number' : 'Add Roll Number'}</button>
            </form>
            <button onClick={handleSubmit}>Save Roll Numbers</button>
            <div className="roll-list">
                <ul>
                    {rollNumbers.map((roll, index) => (
                        <li key={index}>
                            {roll}
                            <button onClick={() => handleEditRollNumber(index)}>Edit</button>
                            <button onClick={() => handleRemoveRollNumber(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Admin;
