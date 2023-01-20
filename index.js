// const { ApolloServer } = require("@apollo/server");
// const { startStandaloneServer } = require("@apollo/server/standalone");
const cors = require("cors");
var fs = require("fs");
const express = require("express");
const app = express();
const Joi = require("joi");
const bodyParser = require("body-parser");
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
//app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
// app.use(cors()); // disable cors policy

app.use(express.static("public"));
// // Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  //   // Request methods you wish to allow
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  //   // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  //   // Set to true if you need the website to include cookies in the requests sent
  //   // to the API (e.g. in case you use sessions)
  // res.setHeader("Access-Control-Allow-Credentials", true);
  //   // Pass to next layer of middleware
  next();
});
// const typeDefs = `#graphql
//   type User {
//     id:Int
//     email: String
//     password: String
//   }
//   type UsersOutput{
//       payload:[User]
//       message:String
//       status:Int
//   }
//   type Output{
//       payload:User
//       message:String
//       status:Int
//   }
//   type response{
//       payload:[User]
//       message:String
//       status:Int
//   }
//   type Query {
//     users: UsersOutput
//     user(email:String!,password:String!):Output
//   }
//   type Mutation{
//       addUser(email:String!,password:String!):response
//   }
// `;
const data = fs.readFileSync("./data.json");
const jsonData = JSON.parse(data);

// const resolvers = {
//   Query: {
//     users: () => {
//       return { payload: jsonData, message: "success", status: 200 };
//     },
//     user: (parent, args, context) => {
//       const user = jsonData.find(
//         (us) => us.email == args.email && us.password == args.password
//       );
//       return { payload: user, message: "success", status: 200 };
//     },
//   },
//   Mutation: {
//     addUser: (parent, args, context) => {
//       var payload = [
//         ...jsonData,
//         {
//           id: Math.ceil(Math.random()),
//           email: args.email,
//           password: args.password,
//         },
//       ];
//       fs.writeFileSync("data.json", JSON.stringify(payload), function (err) {
//         console.log(err, "error occured in add User");
//       });
//       return { payload, message: "Success", status: 201 };
//     },
//   },
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// (async function () {
//   const { url } = await startStandaloneServer(server, {
//     listen: { port: 4000 },
//   });
//   console.log(`🚀  Server ready at: ${url}`);
// })();
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("nsfesfgu 444444");

  res.send("Heelo world");
});

app.post("/signin", (req, res) => {
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send("Email and password required for login");
    return;
  }
  const data = jsonData.find(
    (js) => js.email === req.body.email && js.password == req.body.password
  );
  if (data?.email) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send(data);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(400).send("User Not Found!");
  }
});

app.get("/users/:id", (req, res) => {
  const user = jsonData.find((us) => us.id == req.params.id);
  if (!user) res.status(404).send("the user with given id doesn't exist");
  res.send(user);
});

app.post("/signup", (req, res) => {
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
  };
  const result = Joi.validate(req.body, schema);
  // console.log("first", result)
  if (result.error) {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(400).send("Email and password required");
    return;
  }
  var obj = {
    id: jsonData?.length + 1,
    email: req.body.email,
    password: req.body.password,
  };
  var payload = [...jsonData, obj];
  fs.writeFileSync("data.json", JSON.stringify(payload), function (err) {
    console.log(err, "error occured in add User");
  });
  res.header("Access-Control-Allow-Origin", "*");
  res.send(obj);
});

app.listen(4000, () => console.log("Listening to port 4000"));
