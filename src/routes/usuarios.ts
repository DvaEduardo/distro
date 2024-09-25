import { Router } from 'express';
import { actualizarUnUsuario, cambiarPassword, eliminarUnUsuario, login, obtenerTodosUsuarios, registrarUsuario } from '../operator/functions';
const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Verifica las credenciales del usuario y devuelve un token JWT si son correctas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Correo:
 *                 type: string
 *                 example: admin@admin.com.mx
 *               Contraseña:
 *                 type: string
 *                 example: Admin
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV2aWxsYW51ZXZhQGV1cm9tdW5kby5jb20ubXgiLCJleHAiOjE3MjcyOTUwMjF9.ffugqmmI79IsHoDe3rl4n8ZLv3UAPoobS6P8tcNftjM"
 *                 expiracion:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-25T20:10:21.3919866Z"
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error en el servidor
 */

router.post('/login', login);


/**
 * @swagger
 * /cambiarContraseña:
 *   post:
 *     summary: Cambiar la contraseña del usuario
 *     description: Permite cambiar la contraseña de un usuario existente a partir de su correo electrónico.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Correo:
 *                 type: string
 *                 example: "usuario@example.com"
 *               nuevaContrasena:
 *                 type: string
 *                 example: "NuevaContraseña123"
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada exitosamente"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.post('/cambiarContraseña', cambiarPassword);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener listado de usuarios
 *     description: Retorna todos los usuarios
 *     responses:
 *       200:
 *         description: Éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   IdUsuario:
 *                     type: integer
 *                     example: 0
 *                   Nombre:
 *                     type: string
 *                     example: example
 *                   Apellidos:
 *                     type: string
 *                     example: example
 *                   Correo:
 *                     type: string
 *                     example: example@example.com.mx
 *                   Contrasena:
 *                     type: string
 *                     example: example
 *                   RolId:
 *                     type: integer
 *                     example: 0
 *                   Activo:
 *                     type: integer
 *                     example: 0
 *                   FechaCreacion:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-09-24 21:00:25
 */
router.get('/usuarios', obtenerTodosUsuarios);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un usuario
 *     description: Crea un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Apellidos:
 *                 type: string
 *               Correo:
 *                 type: string
 *               Contraseña:
 *                 type: string
 *               RolId:
 *                 type: integer
 *               Activo:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario creado exitosamente
 */
router.post('/usuarios', registrarUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Actualiza los datos de un usuario existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Apellidos:
 *                 type: string
 *               Correo:
 *                 type: string
 *               Contraseña:
 *                 type: string
 *               RolId:
 *                 type: integer
 *               Activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario actualizado exitosamente
 */
router.put('/usuarios/:id', actualizarUnUsuario);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario eliminado exitosamente
 */
router.delete('/usuarios/:id', eliminarUnUsuario);

export default router;
