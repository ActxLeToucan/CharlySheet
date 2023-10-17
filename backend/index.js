import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(httpServer, { cors: { origin: '*' } });
io.on('connection', (socket) => {
    socket.on('ping', () => {
        socket.emit('pong', 'pong!!!');
    });
    // join room
    socket.on('join', (room) => {
        // test if guy has permission to join room
        // reject him
        socket.join(room);
    });
});

app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

httpServer.listen(port, () => {
    console.log(`listening on *:${port}`);
});

class SparseMatrix {
    constructor() {
        this.data = new Map();
    }

    setValue(rowKey, colKey, value) {
        if (!this.data.has(rowKey)) {
            this.data.set(rowKey, new Map());
        }

        this.data.get(rowKey).set(colKey, value);
    }

    getValue(rowKey, colKey) {
        if (this.data.has(rowKey) && this.data.get(rowKey).has(colKey)) {
            return this.data.get(rowKey).get(colKey);
        } else {
            return 0; // Valeur par défaut si la clé n'existe pas dans la matrice creuse
        }
    }

    toString() {
        let matrixString = '';

        for (const [rowKey, rowData] of this.data) {
            for (const [colKey, value] of rowData) {
                matrixString += `(${rowKey}, ${colKey}): ${value}\n`;
            }
        }

        return matrixString;
    }
    getMaxValueLength() {
        let maxLength = 1;
        // eslint-disable-next-line no-unused-vars
        for (const [_rowKey, rowData] of this.data) {
            // eslint-disable-next-line no-unused-vars
            for (const [_colKey, value] of rowData) {
                const valueLength = String(value).length;
                if (valueLength > maxLength) {
                    maxLength = valueLength;
                }
            }
        }
        return maxLength;
    }
    toJSON() {
        return JSON.stringify([...this.data]);
    }

    fromJSON(json) {
        const data = JSON.parse(json);
        data.forEach((element) => {
            const rowKey = element[0];
            const rowData = element[1];
            rowData.forEach((value, colKey) => {
                this.setValue(rowKey, colKey, value);
            });
        });
    }
}

// Exemple d'utilisation de la classe SparseMatrix
const myMatrix = new SparseMatrix();

myMatrix.setValue(1, 2, 42);
myMatrix.setValue(0, 0, 7);
myMatrix.setValue(2, 3, 10);
const maxValueLength = myMatrix.getMaxValueLength();

for (let y = 0; y < 11; y++) {
    let line = '';
    for (let x = 0; x < 11; x++) {
        const value = myMatrix.getValue(x, y);
        const paddedValue = String(value).padStart(maxValueLength, ' ');
        line += paddedValue + ' ';
    }
    console.log(line);
}

console.log(`Valeur à la clé (1, 2) : ${myMatrix.getValue(1, 2)}`);
console.log(`Valeur à la clé (1, 1) : ${myMatrix.getValue(1, 1)}`);

console.log(myMatrix.toJSON());

const myMatrix2 = new SparseMatrix();
myMatrix2.fromJSON(myMatrix.toJSON());
console.log(myMatrix2.toJSON());

console.log(myMatrix.toString());
console.log(myMatrix2.toString());
