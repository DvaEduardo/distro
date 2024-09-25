import { UsuarioRol } from "../interfaces/InterfaceUsuarios";


export const JWT_SECRET = '$2y$10$MNvvAcdHj5/NAEjwNSKR7eaggKtop8Lmz40oxmmp.sL4ldEGCSImW';
export const generarToken = (usuario: UsuarioRol): string => {
    var jwt = require('jsonwebtoken');
    const exp = Math.floor(Date.now() / 1000) + (2 * 60 * 60);
    const token = jwt.sign({
      IdUsuario: usuario.IdUsuario,
      Nombre: usuario.Nombre,
      Apellidos: usuario.Apellidos,
      Correo: usuario.Correo,
      Contraseña: usuario.Contraseña,
      RolId: usuario.RolId,
      Activo: usuario.Activo,
      FechaCreacion: usuario.FechaCreacion,
      IdRol: usuario.IdRol,
      Rol: usuario.Rol,
      exp 
    }, JWT_SECRET);
    return token;
  };