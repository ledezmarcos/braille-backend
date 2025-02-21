// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "https://marcosledezma.com", // Reemplaza con tu dominio
    methods: "GET,POST",
    allowedHeaders: "Content-Type",
  }));

app.use(express.json());


// Mapeo de teclas físicas a puntos Braille
const keyToBraille = {
  "s": "1", "d": "2", "f": "3",
  "j": "4", "k": "5", "l": "6"
};

// Diccionario básico de Braille a texto (puntos 1-6 representados como "123456")
const brailleMap = {
  "1": "A", "12": "B", "14": "C", "145": "D", "15": "E", "124": "F",
  "1245": "G", "125": "H", "24": "I", "245": "J", "13": "K", "123": "L",
  "134": "M", "1345": "N", "135": "O", "1234": "P", "12345": "Q", "1235": "R",
  "234": "S", "2345": "T", "136": "U", "1236": "V", "2456": "W", "1346": "X",
  "13456": "Y", "1356": "Z"
};

let inputBuffer = new Set();
let inputTimeout;

// Endpoint para convertir teclas Braille a texto
app.post("/convert", (req, res) => {
  const { keys } = req.body; 
  
  if (keys === " ") {
    return res.json({ text: " " }); // Espacio
  }
  if (keys === "\n") {
    return res.json({ text: "\n" }); // Salto de línea
  }

  keys.split("").forEach(key => {
    if (keyToBraille[key]) {
      inputBuffer.add(keyToBraille[key]);
    }
  });

  clearTimeout(inputTimeout);
  inputTimeout = setTimeout(() => {
    const braillePoints = Array.from(inputBuffer).sort().join("");
    const text = brailleMap[braillePoints] || "?";
    inputBuffer.clear();
    res.json({ text });
  }, 50); // Pequeño retardo para capturar todas las teclas
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
