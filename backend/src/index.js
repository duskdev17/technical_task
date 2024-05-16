const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

app.post('/save', (req, res) => {
    const { positions, total } = req.body;
    db.run("INSERT INTO data (positions, total) VALUES (?, ?)", [positions.join(','), total], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

app.get('/retrieve', (req, res) => {
    db.all("SELECT * FROM data", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
