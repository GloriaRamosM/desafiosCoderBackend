import passport from "passport";
import local from "passport-local";
import userService from "../dao/models/Users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2"; // se instalo para la estrategia de Github y asociarse en el inicio de sesion
import dotenv from "dotenv";

// variables de entorno
dotenv.config();

const ClientIDGithub = process.env.ClientIDGithub;

const ClientSecretGithub = process.env.ClientSecretGithub;

const CallbackGithub = process.env.CallbackGithub;

const LocalStrategy = local.Strategy;

const initilizePassport = () => {
  //estrategia de passport para el register
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        // aca recibimos todo por body
        const { first_name, last_name, email, age } = req.body;

        try {
          //primero lo busca y comparar por mail
          const user = await userService.findOne({ email: username });
          if (user) {
            console.log("El usuario existe");
            return done(null, false);
          }
          // si no existe pasa a crearlo
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          //crea y guarda al usuaruo
          const result = await userService.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("error al crear al usuario" + error);
        }
      }
    )
  );

  // estrategia de passport para el Login
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userService.findOne({ email: username });
          if (!user) return done(null, false);
          const valid = isValidPassword(user, password);
          if (!valid) return done(null, false);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //estrategia para iniciar sesion con Github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: ClientIDGithub, //id de la app en github
        clientSecret: ClientSecretGithub, //clave secreta de github
        callbackURL: CallbackGithub, //url callback de github
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          //aca habia un console.log de porfile //obtenemos el objeto del perfil que me trae de github cuando conecta, en produccion se borra dijo el profe
          //buscamos en la db el email
          const user = await userService.findOne({
            email: profile._json.email,
          });
          //si no existe lo creamos
          if (!user) {
            //contruimos el objeto según el modelo (los datos no pertenecientes al modelo lo seteamos por default)
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 28,
              email: profile.emails[0].value,
              password: "",
            };

            // aca arriba se creo el NewUser con el nombre que trae de git
            //y el email los demas por default los dejamos blanco y la edad seteada random

            //guardamos el usuario en la database
            let createdUser = await userService.create(newUser);
            // aca es donde se crea
            done(null, createdUser);
            console.log(createdUser, profile);
          } else {
            done(null, user);
            console.log(user, profile);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Serializar y deserializar usuario

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userService.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initilizePassport;
