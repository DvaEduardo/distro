import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = Router();
const uploadPath = path.join(__dirname, '../uploads');

// Configuración de multer para guardar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  }
});
const upload = multer({ storage });

// Middleware para crear la carpeta si no existe
const ensureUploadsFolderExists = (req: Request, res: Response, next: Function) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  next();
};

/**
 * @swagger
 * /archivos/guardar:
 *   post:
 *     summary: Subir un archivo
 *     description: Permite subir un archivo y almacenarlo en el servidor.
 *     tags:
 *       - Archivos
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Archivo subido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Archivo subido exitosamente
 *                 file:
 *                   type: object
 *                   properties:
 *                     fieldname:
 *                       type: string
 *                       example: archivo
 *                     originalname:
 *                       type: string
 *                       example: 
 *                     encoding:
 *                       type: string
 *                       example: 7bit
 *                     mimetype:
 *                       type: string
 *                       example: image/png
 *                     destination:
 *                       type: string
 *                       example: ./uploads/
 *                     filename:
 *                       type: string
 *                       example: 1633021373134.png
 *                     path:
 *                       type: string
 *                       example: ./uploads/1633021373134.png
 *                     size:
 *                       type: integer
 *                       example: 1024
 *       400:
 *         description: No se ha subido ningún archivo
 *       500:
 *         description: Error al subir el archivo
 */
router.post('/guardar', ensureUploadsFolderExists, upload.single('archivo'), (req: Request, res: Response) => {
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo' });
  }

  res.status(200).json({
    message: 'Archivo subido exitosamente',
    file
  });
});

/**
 * @swagger
 * /archivos/buscar/{nombre}:
 *   get:
 *     summary: Buscar un archivo
 *     description: Busca un archivo por su nombre en el servidor y lo devuelve.
 *     tags:
 *       - Archivos
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         description: El nombre del archivo que se busca.
 *         schema:
 *           type: string
 *           example: 
 *     responses:
 *       200:
 *         description: Archivo encontrado
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Archivo no encontrado
 *       500:
 *         description: Error al buscar el archivo
 */
router.get('/buscar/:nombre', (req: Request, res: Response) => {
  const { nombre } = req.params;
  const filePath = path.join(uploadPath, nombre);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Archivo no encontrado' });
  }
});

/**
 * @swagger
 * /archivos/eliminar/{nombre}:
 *   delete:
 *     summary: Eliminar un archivo
 *     description: Elimina un archivo por su nombre del servidor.
 *     tags:
 *       - Archivos
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         description: El nombre del archivo que se desea eliminar.
 *         schema:
 *           type: string
 *           example: 
 *     responses:
 *       200:
 *         description: Archivo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Archivo eliminado exitosamente
 *       404:
 *         description: Archivo no encontrado
 *       500:
 *         description: Error al eliminar el archivo
 */
router.delete('/eliminar/:nombre', (req: Request, res: Response) => {
  const { nombre } = req.params;
  const filePath = path.join(uploadPath, nombre);

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: 'Archivo eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el archivo' });
    }
  } else {
    res.status(404).json({ error: 'Archivo no encontrado' });
  }
});

export default router;
