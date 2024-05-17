import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [numTextboxes, setNumTextboxes] = useState(0);
    const [textboxes, setTextboxes] = useState([]);
    const [data, setData] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0);
    const [allChecked, setAllChecked] = useState(false);

    const handleAddTextboxes = () => {
        const newTextboxes = Array.from({ length: numTextboxes }, (_, index) => ({
            id: index,
            value: '',
            checked: false,
        }));
        setTextboxes(newTextboxes);
        setAllChecked(false);
        setSelectedCount(0);
    };

    const handleInputChange = (index, value) => {
        const newTextboxes = [...textboxes];
        newTextboxes[index].value = value;
        setTextboxes(newTextboxes);
    };

    const handleCheckboxChange = (index, checked) => {
        const newTextboxes = [...textboxes];
        newTextboxes[index].checked = checked;
        setTextboxes(newTextboxes);
        updateSelectedCount(newTextboxes);
    };

    const handleAllCheckChange = (checked) => {
        const newTextboxes = textboxes.map(tb => ({ ...tb, checked }));
        setTextboxes(newTextboxes);
        setAllChecked(checked);
        updateSelectedCount(newTextboxes);
    };

    const updateSelectedCount = (newTextboxes) => {
        const count = newTextboxes.filter(tb => tb.checked).length;
        setSelectedCount(count);
    };

    const handleSaveData = async () => {
        const selectedTextboxes = textboxes.filter(tb => tb.checked);
        const total = selectedTextboxes.reduce((sum, tb) => sum + parseInt(tb.value || 0, 10), 0);

        let positions = [];
        if (selectedTextboxes.length !== textboxes.length) {
            positions = selectedTextboxes.map(tb => tb.id);
        }

        await axios.post('/src/save', { positions, total });
        fetchData();
    };

    const fetchData = async () => {
        const response = await axios.get('/src/retrieve');
        setData(response.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ marginBottom: 20 }}>Technical Task</h1>
            <div style={{ marginBottom: 20 }}>
                <label style={{ marginRight: 10 }}>Number of Textboxes: </label>
                <input type="number" value={numTextboxes} onChange={e => setNumTextboxes(e.target.value)} style={{ padding: 10, borderRadius: 5, border: '1px solid #ccc' }} />
                <button style={{ backgroundColor: 'blue', marginLeft: 10, padding: '10px 20px', borderRadius: 5, color: 'white', border: 'none', cursor: 'pointer' }} onClick={handleAddTextboxes}>Add Textbox</button>
            </div>
            <div style={{ marginBottom: 20 }}>
                <label style={{ marginRight: 10 }}>
                    <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={e => handleAllCheckChange(e.target.checked)}
                    />
                    <span style={{ marginLeft: 5 }}>All Check</span>
                </label>
            </div>
            <div>
                {textboxes.map((tb, index) => (
                    <div key={index} style={{ marginBottom: 10 }}>
                        <input
                            type="number"
                            value={tb.value}
                            onChange={e => handleInputChange(index, e.target.value)}
                            style={{ padding: 10, borderRadius: 5, border: '1px solid #ccc' }}
                        />
                        <input
                            type="checkbox"
                            checked={tb.checked}
                            onChange={e => handleCheckboxChange(index, e.target.checked)}
                            style={{ marginLeft: 10, cursor: 'pointer', backgroundColor: tb.checked ? 'green' : '', borderRadius: '50%', width: 20, height: 20 }}
                        />
                    </div>
                ))}
            </div>
            <button style={{ backgroundColor: '#4CAF50', padding: '10px 20px', borderRadius: 5, color: 'white', border: 'none', cursor: 'pointer', marginTop: 20 }} onClick={handleSaveData}>Save Data</button>
    
            <p style={{ marginTop: 20 }}>Number of selected items: {selectedCount}</p>
            <ul>
                {data.map(entry => (
                    <li key={entry.id}>
                        {entry.positions.length ? `Positions: ${entry.positions}` : 'All items selected'}, Total: {entry.total}
                    </li>
                ))}
            </ul>
        </div>
    );
    
}  

export default App;
