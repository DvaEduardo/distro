import connection from "../appsettings";
import { Usuario, UsuarioRol } from "../interfaces/InterfaceUsuarios";
import crypto from 'crypto';

// Función para obtener todos los usuarios y sus roles
export const obtenerUsuarios = async (): Promise<UsuarioRol[]> => {
    const [result] = await connection.query('CALL ObtenerUsuarioRol()') as [any[], any];
    const users: UsuarioRol[] = result[0] as UsuarioRol[];
    return users;
};

// Función para crear un nuevo usuario con la contraseña encriptada
export const crearUsuario = async (usuario: Usuario): Promise<void> => {
  const hashedPassword = crypto.createHash('md5').update(usuario.Contraseña).digest('hex');
  const query = `
    INSERT INTO usuario (Nombre, Apellidos, Correo, Contraseña, RolId, Activo) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [usuario.Nombre, usuario.Apellidos, usuario.Correo, hashedPassword, usuario.RolId, usuario.Activo];
  await connection.query(query, values);
};

// Función para actualizar un usuario
export const actualizarUsuario = async (id: number, usuario: Usuario): Promise<void> => {
  const hashedPassword = crypto.createHash('md5').update(usuario.Contraseña).digest('hex');
  const query = `
    UPDATE usuario 
    SET Nombre = ?, Apellidos = ?, Correo = ?, Contraseña = ?, RolId = ?, Activo = ? 
    WHERE IdUsuario = ?
  `;
  const values = [usuario.Nombre, usuario.Apellidos, usuario.Correo, hashedPassword, usuario.RolId, usuario.Activo, id];
  await connection.query(query, values);
};

// Función para eliminar un usuario
export const eliminarUsuario = async (id: number): Promise<void> => {
  const query = 'DELETE FROM usuario WHERE IdUsuario = ?';
  await connection.query(query, [id]);
};


// Función para buscar un usuario por correo y contraseña
export const buscarUsuarioPorCredenciales = async (correo: string, contraseña: string): Promise<UsuarioRol | null> => {
    // Encriptar la contraseña ingresada con MD5
    const hashedPassword = crypto.createHash('md5').update(contraseña).digest('hex');
    const [rows] = await connection.query('SELECT * FROM usuario WHERE Correo = ? OR Contraseña = ?', [correo, hashedPassword]) as [UsuarioRol[], any];
    // Si no se encuentra el usuario, devolvemos null
    if (rows.length === 0) {
      return null;
    }
    return rows[0]; // Devolver el usuario encontrado
  };

  // Función para buscar un usuario por correo y contraseña
export const buscarUsuarioPorCorreo = async (correo: string): Promise<UsuarioRol | null> => {
    const [rows] = await connection.query('SELECT * FROM usuario WHERE Correo = ?', [correo]) as [UsuarioRol[], any];
    // Si no se encuentra el usuario, devolvemos null
    if (rows.length === 0) {
      return null;
    }
    return rows[0]; // Devolver el usuario encontrado
  };

  // Función para cambiar la contraseña del usuario
export const cambiarContrasena = async (correo: string, nuevaContrasena: string): Promise<void> => {
    // Encriptar la nueva contraseña con MD5
    const hashedPassword = crypto.createHash('md5').update(nuevaContrasena).digest('hex');
  
    // Actualizar la contraseña del usuario por correo
    const query = 'UPDATE usuario SET Contraseña = ? WHERE Correo = ?';
    await connection.query(query, [hashedPassword, correo]);
  };
  