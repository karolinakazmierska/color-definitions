import './App.css';
import React, { useState, useEffect} from 'react';

function App() {
    const [colors, setColors] = useState([] as ColorObj[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [colorsCount, setColorsCount] = useState(0);

    const [newColorName, setNewColorName] = useState("");
    const [newColorHex, setNewColorHex] = useState("#b866d2");
    const [addNewColorError, setAddNewColorError] = useState(false);

    type ColorObj = {
        id: number,
        name: string,
        hex: string
    };

    useEffect(() => {
        fetch('https://colors-definitions-api.herokuapp.com/colors')
            .then(response => response.json())
            .then(data => {
                setColors(data);
                setColorsCount(data.length);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setError(true);
            })
    }, [colorsCount])

    const addColor = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!newColorName || !newColorHex) {
            setAddNewColorError(true);
            return;
        }

        fetch('https://colors-definitions-api.herokuapp.com/colors', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newColorName, hex: newColorHex })
            })
            .then(response => response.json())
            .then(data => {
                setAddNewColorError(false);
                setNewColorName("");
                setColorsCount(colorsCount + 1);
            })
            .catch(error => {
                console.log(error);
            })
     };

     const deleteColor = (id: number) => {
        fetch(`https://colors-definitions-api.herokuapp.com/colors/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                setColorsCount(colorsCount - 1);
            })
            .catch(error => {
                console.log(error);
            })
     }

    if (loading) return "Loading...";
    if (error) return "Error";

    return (
        <div className="container">
            <div className="title">Color definitions app</div>
            <div className="add-color-container">
                <form onSubmit={addColor}>
                    <div className="input-container">
                        <label htmlFor="newColorName">Name:</label>
                        <input
                            name="newColorName"
                            type="text"
                            maxLength={20}
                            value={newColorName}
                            onChange={e => setNewColorName(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="newColorHex">Hex:</label>
                        <input
                            name="newColorHex"
                            type="color"
                            value={newColorHex}
                            onChange={e => setNewColorHex(e.target.value)}
                        />
                    </div>
                    <input type="submit" value="Add new color" className="submit" />
                    {
                        addNewColorError && <span className="error">Fill in all fields</span>
                    }
                </form>
            </div>
            <div className="colors-container">
                {colors.map((color: ColorObj) => {
                    return (
                        <div className="color-container" key={color.id}>
                            <div className="color-box" style={{backgroundColor: color.hex}}></div>
                            <p>{color.name}</p>
                            <p>{color.hex}</p>
                            <div className="delete" onClick={() => deleteColor(color.id)}>delete</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default App;
