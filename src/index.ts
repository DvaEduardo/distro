import express from 'express';
import { setupSwagger } from './swagger';
import Usuarios from './routes/usuarios';
import Archivos from './routes/archivos';


const app = express();
const port = 3000;
app.use(express.json());
setupSwagger(app);
app.use('/api', Usuarios);
app.use('/api/archivos', Archivos);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}/api`);
});
