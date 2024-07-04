import passport from "passport";
import local from "passport-local";
import userService from "../dao/mongo/models/Users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2"; // se instalo para la estrategia de Github y asociarse en el inicio de sesion
import jwt from "passport-jwt";
import config from "../config.js";

// para la estrategia de passport con Github// me lo traigo de config y en config tengo la configuracion de dotenv para la variables de entorno
const ClientIDGithub = config.ClientIdGithub;

const ClientSecretGithub = config.ClientSecretGithub;

const CallbackGithub = config.CallbackGithub;

// para la estrategia de passport local
const LocalStrategy = local.Strategy;

//para la estrategia de passport con jwt = token
const JWTStrategy = jwt.Strategy;
const ExtracJWT = jwt.ExtractJwt;

const initilizePassport = () => {
  //estrategia de passport para el register
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        // aca recibimos todo por body
        const { first_name, last_name, email, age, rol } = req.body;

        try {
          //primero lo busca y comparar por mail
          const user = await userService.findOne({ email: username });
          if (user) {
            Logger.info("El usuario existe");
            return done(null, false);
          }
          // si no existe pasa a crearlo
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            rol,
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
          console.log({ user });
          return done(null, user);
        } catch (error) {
          console.log({ error });
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
            Logger.debug(createdUser, profile);
          } else {
            done(null, user);
            Logger.debug(user, profile);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["desafio-integrador"];
    }
    return token;
  };

  //Estrategia para jwt
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtracJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "desafio-integrador",
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
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
