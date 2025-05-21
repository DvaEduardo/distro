
import { Request, Response } from 'express';
import { buscarUsuarioPorCredenciales, cambiarContrasena, buscarUsuarioPorCorreo, obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../operator/DbOperator';
import { generarToken, uploadPath } from '../utilidades/constantes';
import { Usuario } from '../interfaces/InterfaceUsuarios';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * @summary Método que permite iniciar sesión.
 * @param {Request} req - Solicitud HTTP que contiene el correo y la contraseña del usuario.
 * @param {Response} res - Respuesta HTTP con el token JWT y la fecha de expiración si las credenciales son correctas.
 * @returns {Promise<Response>} Devuelve un objeto JSON con el token y la fecha de expiración o un mensaje de error en caso de credenciales incorrectas o fallo en el servidor.
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
    const { Correo, Contraseña } = req.body;
    if (!Correo || !Contraseña) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }
    try {
      const usuario = await buscarUsuarioPorCredenciales(Correo, Contraseña);
      if (!usuario) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
      const token = generarToken(usuario);
      const expiracionISO = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      return res.json({
        token,
        expiracion: expiracionISO
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  };

/**
 * @summary Método que permite cambiar la contraseña de un usuario.
 * @param {Request} req - Solicitud HTTP que contiene el correo del usuario y la nueva contraseña.
 * @param {Response} res - Respuesta HTTP con un mensaje que indica si el cambio de contraseña fue exitoso o no.
 * @returns {Promise<Response>} Devuelve un mensaje de éxito si la contraseña se actualizó correctamente o un error si el usuario no fue encontrado o ocurrió un fallo en el servidor.
 */
export const cambiarPassword = async (req: Request, res: Response): Promise<Response> => {
    const { Correo, nuevaContrasena } = req.body;
    if (!Correo || !nuevaContrasena) {
      return res.status(400).json({ error: 'Correo y nueva contraseña son obligatorios' });
    }
    try {
      const usuario = await buscarUsuarioPorCorreo(Correo);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      await cambiarContrasena(Correo, nuevaContrasena);
      return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      return res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
  };

  /**
 * @summary Método que obtiene todos los usuarios de la base de datos.
 * @param {Request} req - Solicitud HTTP.
 * @param {Response} res - Respuesta HTTP con el listado de usuarios.
 * @returns {Promise<Response>} Devuelve un objeto JSON con el listado de usuarios o un error si ocurrió algún problema en el servidor.
 */
export const obtenerTodosUsuarios = async (req: Request, res: Response): Promise<Response> => {
    try {
      const usuarios = await obtenerUsuarios();
      return res.json(usuarios);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener usuarios y roles' });
    }
  };
  
/**
 * @summary Método que permite registrar un nuevo usuario.
 * @param {Request} req - Solicitud HTTP que contiene los datos del nuevo usuario.
 * @param {Response} res - Respuesta HTTP con un mensaje indicando si la creación del usuario fue exitosa o no.
 * @returns {Promise<Response>} Devuelve un mensaje de éxito si el usuario se creó correctamente o un error si faltan campos o ocurrió un fallo en el servidor.
 */
  export const registrarUsuario = async (req: Request, res: Response): Promise<Response> => {
    const { Nombre, Apellidos, Correo, Contraseña, RolId, Activo } = req.body;
    if (!Nombre || !Apellidos || !Correo || !Contraseña || !RolId || Activo === undefined) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try {
      const nuevoUsuario: Usuario = {
        Nombre,
        Apellidos,
        Correo,
        Contraseña,
        RolId,
        Activo
      };
      await crearUsuario(nuevoUsuario);
      return res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error) {
      return res.status(500).json({ error: 'Error al crear usuario' });
    }
  };
  
/**
 * @summary Método que actualiza los datos de un usuario existente.
 * @param {Request} req - Solicitud HTTP que contiene los nuevos datos del usuario.
 * @param {Response} res - Respuesta HTTP con un mensaje que indica si la actualización fue exitosa o no.
 * @returns {Promise<Response>} Devuelve un mensaje de éxito si el usuario fue actualizado correctamente o un error si faltan campos o ocurrió un fallo en el servidor.
 */
  export const actualizarUnUsuario = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { Nombre, Apellidos, Correo, Contraseña, RolId, Activo } = req.body;
    if (!Nombre || !Apellidos || !Correo || !Contraseña || !RolId || Activo === undefined) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try {
      const usuarioActualizado: Usuario = {
        Nombre,
        Apellidos,
        Correo,
        Contraseña,
        RolId,
        Activo
      };
      await actualizarUsuario(parseInt(id), usuarioActualizado);
      return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  };
  
/**
 * @summary Método que elimina un usuario existente.
 * @param {Request} req - Solicitud HTTP que contiene el ID del usuario a eliminar.
 * @param {Response} res - Respuesta HTTP con un mensaje que indica si la eliminación fue exitosa o no.
 * @returns {Promise<Response>} Devuelve un mensaje de éxito si el usuario fue eliminado correctamente o un error si ocurrió un fallo en el servidor.
 */
  export const eliminarUnUsuario = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
      await eliminarUsuario(parseInt(id));
      return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  };
  

  // Configuración de multer para guardar los archivos
  export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  }
});

// Middleware para crear la carpeta si no existe
export const ensureUploadsFolderExists = (req: Request, res: Response, next: Function) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  next();
};