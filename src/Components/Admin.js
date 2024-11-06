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
        const trimmedRollNumber = rollNumber.trim();

        if (trimmedRollNumber) {
            // Check for duplicates
            if (rollNumbers.includes(trimmedRollNumber)) {
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

    const handleSubmit = async () => {
        if (rollNumbers.length === 0) {
            alert('No roll numbers to save!');
            return;
        }

        console.log('Sending roll numbers:', rollNumbers);  // Debugging: Check the data

        try {
            const response = await fetch('/api/attendance/saveRollNumbers', { // Ensure correct endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rollNumbers }),
            });

            if (response.ok) {
                alert('Roll numbers have been saved to the database!');
            } else {
                const errorMessage = await response.text();
                console.error('Error saving roll numbers:', errorMessage);  // Log the exact error
                alert(`Failed to save roll numbers: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error saving roll numbers:', error);  // Log any fetch-related errors
            alert('An error occurred while saving roll numbers to the database.');
        }
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
