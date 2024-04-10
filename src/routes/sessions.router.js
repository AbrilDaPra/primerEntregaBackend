import { Router } from "express";
import userModel from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
const router = Router();

//Registro de usuario
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  //Validacion
  const exist = await userModel.findOne({ email: email });
  
  if (exist) {
    return res
      .status(400)
      .send({ status: "error", error: "The email already exists" });
  }

  const user = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
  };

  const result = await userModel.create(user);
  console.log(result);
  res.status(201).send({ staus: "success", payload: result });
});

//Login de usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  
  if (!user) {
    return res
      .status(400)
      .send({ status: "error", error: "Error with credentials" });
  }

  const validarPass = isValidPassword(user, password);
  console.log(validarPass);
  
  if (!validarPass)
    return res
      .status(401)
      .send({ error: "error", message: "Error de credenciales" });

  //Genero la session
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
  };
  // delete user.password;
  // req.session.user = user;
  res.send({
    status: "success",
    payload: req.session.user,
    message: "Successful login",
  });
});

export default router;