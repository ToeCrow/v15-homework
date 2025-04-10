import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the jungle')
})

app.get('/api/welcome', (req, res) => {
  res.header('Custom-Message', 'Välkommen hit!');
  res.send('Checka dina headers! 👀')
});

app.get('/api/headers', (req, res) => {
  res.json(req.headers);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});