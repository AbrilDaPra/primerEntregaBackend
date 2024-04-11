import { Router } from "express";
import { createHash, isValidPassword } from "../utils.js";
import UserManager from "../dao/services/UserManager.js";

const router = Router();
const userManager = new UserManager();

//Registro de usuario
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try{
    const user = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
    };

    const newUser = await userManager.registerUser(user);

    //Verifico las credenciales ingresadas por el usuario
    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      //Asigno el rol de admin
      req.session.user = { email, role: 'admin' };
    } else {
      //Asigno el rol de user
      req.session.user = { email, role: 'user' };
    }

    res.status(201).send({ staus: "success", payload: newUser });
  } catch (err) {
    res.status(400).send({ staus: "error", error: err.message });
  }
});

//Login de usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try{
    const userData = await userManager.logInUser(email, password);

    //Genero la sesion del usuario
    req.session.user = userData;

    res.send({
      status: "success",
      payload: userData,
      message: "Successful login",
    });
  } catch (err) {
    res.status(401).send({ status: "error", error: err.message });
  }
});

//Logout de usuario
router.get('/logout', async (req, res) => {
  try{
    req.session.destroy();
    res.redirect("/login");
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
});

export default router;