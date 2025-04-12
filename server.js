import express from 'express';
import dotenv from 'dotenv';
import { pingCounter, poweredBy, logIpAdress, requireName, logHeaders, authenticateApiKey  } from './middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//! 2 + 3 + 5
app.use(express.json());   // Hantera JSON-data
app.use(poweredBy);        // Lägg till "X-Powered-By"-headern
app.use(logIpAdress); 
// app.use(logHeaders);


app.get('/', (req, res) => {
  res.send('Welcome to the jungle')
})

// 1
app.get('/api/welcome', (req, res) => {
  res.header('Custom-Message', 'Välkommen hit!');
  res.send('Checka dina headers! 👀')
});

// 2 //! 5
app.get('/api/headers', logHeaders, (req, res) => {
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
let user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
};

app.patch('/api/user', (req, res) => {
  if (req.body.name) {
    user.name = req.body.name;
    res.json({ message: `Användarens namn är nu uppdaterat till ${user.name}` });
  } else {
    res.status(400).json({ message: 'Namn saknas i begäran'})
  }
});

// 7
const products = [
  { id: 1, name: 'Penna', price: 10 },
  { id: 2, name: 'Blyertspenna', price: 5 },
  { id: 3, name: 'Sudd', price: 7 },
  { id: 4, name: 'Bläckpenna', price: 12 },
  { id: 5, name: 'Linjal', price: 15 }
];

// app.get('/api/products', (req, res) => {
//   res.json(products);
// })

app.get('/api/products/:id', (req, res) => {
  const productID = parseInt(req.params.id);
  const product = products.find(p => p.id === productID);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Produkt inte hittad' });
  }
});

// 8
app.get('/api/products', (req, res) => {
  const { sort } = req.query;

  let sortedProducts = [...products];

  if (sort === 'name') {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if  (sort === 'price') {
    sortedProducts.sort((a, b) => a.price - b.price);
  }

  res.json(sortedProducts); 
})

// 9
app.post('/api/products' , (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Både name och price måste vara med i begäran!'})
  }

  const newProduct = {
    id: products.length +1,
    name: name,
    price: price
  };

  products.push(newProduct);

  res.json(products)
})

// 10
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price } = req.body;

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Produkten hittades inte'});
  }

  if (name) product.name = name;
  if (price) product.price = price;

  res.json({ message: 'Produkten uppdaterdes', product});
});

// 11
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Produkten hittades inte'});
  }

  products.splice(index, 1)

  res.json ( { message: 'Produkten har tagits bort', products});
});

// ! Middleware
//! 1 
// 13
app.get('/api/ping', pingCounter, (req, res) => {
  res.setHeader('X-Server-Status', 'active');
  res.json({message: 'pong'});
});

//! 4
// 15
const users = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    pets: []
  }
];
let userId = 1;

app.post('/api/users', requireName, (req, res) => {
  const { name, email } = req.body;

  const newUser = {
    id: userId++,
    name, 
    email 
    };
  users.push(newUser);
  res.status(201).json({ message: `User ${name} created!`})
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

//! 6
app.get('/api/secure-data', authenticateApiKey, (req, res) => {
  res.json({ message: 'Du har tillgång till den skyddade datan!' });
});

// Annan offentlig route
app.get('/api/public', (req, res) => {
  res.json({ message: 'Denna route är offentlig och kräver ingen autentisering.' });
});

// 12 CRUD
app.post('/api/validate-name', (req, res)=>{
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (name.length < 3) {
    return res.status(400).json({ error: 'Name must beat least 3 characters long' });
  }

  res.status(200).json({ message: 'Name is valid'})
})

// 14
app.get('/api/check/:value', (req, res) => {
  const { value } = req.params;

  if (value === 'ok') {
    return res.status(200).json({ message: 'Allt ser bra ut!'});
  }

  return res.status(400).json({ error: 'Värdet är inte godkänt!'});
});

// 16
app.post('/api/users/:id/pets', (req, res) => {
  const userId = parseInt(req.params.id);
  const { type, name } = req.body;

  const user = users.find (u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'Användaren hittades inte.'});
  }

  if (!type || !name) {
    return res.status(404).json({ message: 'Både typ och namn på djuret krävs.'});
  }

  const newPet = { type, name };
  user.pets.push(newPet);

  res.status(201).json({ 
    message:`Husdjur tillagt för ${user.name}`,
    pet: newPet,
  })
});

app.get('/api/users/:id/pets', (req, res) => {
  const userId = parseInte(req.params.id);
  const user = users.find(u => u.id ===userId);

  if (!user) {
    return res.status(404).json({ message: 'Användaren hittades inte.' });
  }

  res.json(user.pets);
}); 

// 17
app.get('/api/stats', (req, res) => {
  const totalProducts = products.length;
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  const averagePrice = totalProducts > 0 ? totalPrice / totalProducts : 0;

  res.json({
    totalProducts,
    averagePrice: Number(averagePrice.toFixed(2))
  });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

