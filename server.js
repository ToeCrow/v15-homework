import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the jungle')
})

// 1
app.get('/api/welcome', (req, res) => {
  res.header('Custom-Message', 'Välkommen hit!');
  res.send('Checka dina headers! 👀')
});

// 2
app.get('/api/headers', (req, res) => {
  res.json(req.headers);
});

// 3
app.get('/api/name', (req, res) => {
  res.json({ name: 'Thomas'});
})

// 4
app.get('/api/greet/:name', (req, res) => {
  const name = req.params.name;
  res.json({ message: `Hej ${name}!`});
});

// 5
app.get('/api/greet', (req, res) => {
  const name = req.query.name;
  res.json({ message: `Hej ${name}!`});
});

// 6


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});