const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const harvester = require('./index.js');
const fs = require('fs');


let data = JSON.parse(fs.readFileSync('guestSessions.json'));

// watch the JSON file for changes
fs.watchFile('guestSessions.json', (curr, prev) => {
    // read the updated JSON data from the file
    data = JSON.parse(fs.readFileSync('guestSessions.json'));
});

app.use(express.json());

app.get('/harvest', (req, res) => {
    harvester.launchSessionHarvester();
    res.json(data);
});

app.get('/clear', (req, res) => {
    data = [];
    fs.writeFileSync('guestSessions.json', JSON.stringify(data));
    res.json(data);
});

app.listen(port, () => {
  console.log(`Harvester listening on port ${port}`);
});


