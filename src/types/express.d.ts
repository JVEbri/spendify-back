import { User } from '../users/users.entity'; // Importa tu entidad de usuario

declare global {
  namespace Express {
    // interface User {
    //   id: string;
    //   googleId: string;
    //   email: string;
    //   name: string;
    // }

    interface Request {
      user?: User; // Añade la propiedad `user` al tipo Request
    }
  }
}
