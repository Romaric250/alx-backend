import express from 'express';
import { promisify } from 'util';
import redis from 'redis';

const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

const getItemById = (id) => listProducts.find((item) => item.id === id);

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const reserveStockById = async (itemId, stock) => {
  await setAsync(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  const stock = await getAsync(`item.${itemId}`);
  return stock;
};

const app = express();
const port = 1245;

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const item = getItemById(parseInt(req.params.itemId, 10));
  if (!item) {
    res.json({ status: 'Product not found' });
  } else {
    const currentQuantity = await getCurrentReservedStockById(item.id);
    res.json({ ...item, currentQuantity: currentQuantity || item.stock });
  }
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const item = getItemById(parseInt(req.params.itemId, 10));
  if (!item) {
    res.json({ status: 'Product not found' });
  } else {
    const currentQuantity = await getCurrentReservedStockById(item.id);
    if (currentQuantity <= 0) {
      res.json({ status: 'Not enough stock available', itemId: item.id });
    } else {
      await reserveStockById(item.id, currentQuantity - 1);
      res.json({ status: 'Reservation confirmed', itemId: item.id });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}/`);
  listProducts.forEach((item) => reserveStockById(item.id, item.stock));
});