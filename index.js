const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const receipts = {};

app.post('/receipts/process', (req, res) => {
    const receipt = req.body;
    const id = uuidv4();
    const points = calculatePoints(receipt);
    receipts[id] = { receipt, points };
    res.json({ id });
});

app.get('/receipts/:id/points', (req, res) => {
    const id = req.params.id;
    if (receipts[id]) {
        res.json({ points: receipts[id].points });
    } else {
        res.status(404).json({ error: 'Receipt not found' });
    }
});

app.listen(port, () => {
    console.log(`Receipt processor app listening at http://localhost:${port}`);
});

function calculatePoints(receipt) {
    let points = 0;

    // 1 point for every alphanumeric character in the retailer name
    points += receipt.retailer.replace(/[^a-z0-9]/gi, '').length;

    // 50 points if the total is a round dollar amount with no cents
    if (parseFloat(receipt.total) === Math.floor(parseFloat(receipt.total))) {
        points += 50;
    }

    // 25 points if the total is a multiple of 0.25
    if (parseFloat(receipt.total) % 0.25 === 0) {
        points += 25;
    }

    // 5 points for every two items on the receipt
    points += Math.floor(receipt.items.length / 2) * 5;

    // If the trimmed length of the item description is a multiple of 3
    receipt.items.forEach(item => {
        const trimmedLength = item.shortDescription.trim().length;
        if (trimmedLength % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    });

    // 6 points if the day in the purchase date is odd
    const purchaseDate = new Date(receipt.purchaseDate);
    if (purchaseDate.getDate() % 2 !== 0) {
        points += 6;
    }

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm
    const purchaseTime = new Date(`1970-01-01T${receipt.purchaseTime}:00`);
    const after2pm = new Date(`1970-01-01T14:00:00`);
    const before4pm = new Date(`1970-01-01T16:00:00`);
    if (purchaseTime > after2pm && purchaseTime < before4pm) {
        points += 10;
    }

    return points;
}
