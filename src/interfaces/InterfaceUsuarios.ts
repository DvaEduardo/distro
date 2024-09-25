export interface Usuario {
  IdUsuario?: number;
  Nombre: string;
  Apellidos: string;
  Correo: string;
  Contraseña: string;
  RolId: number;
  Activo: boolean;
}


export interface UsuarioRol {
    IdUsuario: number;
    Nombre: string;
    Apellidos: string;
    Correo: string;
    Contraseña: string;
    RolId: number;
    Activo: number;
    FechaCreacion: string;
    IdRol: number;
    Rol: string;
  }
  