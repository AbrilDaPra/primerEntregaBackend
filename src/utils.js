import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createHash=(password)=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => {
    console.log(
      `Datos a validar: user-password: ${user.password}, password: ${password}`
    );
    return bcrypt.compareSync(password, user.password);
  };

export default __dirname;