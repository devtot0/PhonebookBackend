const express = require("express");
const app = express();
var morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

let numbers = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

var today = new Date();

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${numbers.length} people</p>
  <p>${today}</p>`);
});

app.get("/api/numbers", (request, response) => {
  response.json(numbers);
});

app.get("/api/numbers/:id", (request, response) => {
  console.log(request.params);
  const id = Number(request.params.id);
  const person = numbers.find((number) => number.id === id);

  if (person) {
    response.json(person);
  } else {
    response.send("resource not found");
    response.status(404).end();
  }
  response.json(person);
});

app.delete("/api/numbers/:id", (request, response) => {
  const id = Number(request.params.id);
  numbers = numbers.filter((number) => number.id != id);
  response.status(204).end();
});

const generateId = () => {
  const maxId =
    numbers.length > 0 ? Math.max(...numbers.map((number) => number.id)) : 0;
  return maxId + 1;
};

app.post("/api/numbers", (request, response) => {
  const body = request.body;
  console.log(body);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (numbers.filter((number) => number.name === body.name)) {
    return response.status(400).json({
      error: "number already exists",
    });
  }

  const number = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  numbers = numbers.concat(number);
  response.json(number);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
