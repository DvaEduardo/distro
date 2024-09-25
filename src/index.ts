import express from 'express';
import { setupSwagger } from './swagger';
import Usuarios from './routes/usuarios';

const app = express();
const port = 3000;
app.use(express.json());
setupSwagger(app);

app.use('/api', Usuarios);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}/api`);
});
