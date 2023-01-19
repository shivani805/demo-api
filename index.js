// const { ApolloServer } = require("@apollo/server");
// const { startStandaloneServer } = require("@apollo/server/standalone");
var fs = require("fs");
const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.json());

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
  res.header("Access-Control-Allow-Origin", "*")
  console.log("nsfesfgu 444444")

  res.send("Heelo world");
});

app.get("/users", (req, res) => {
  console.log("nsfesfgu 3333")
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send("Email and password required");
    return;
  }
  const data = jsonData.map(
    (js) => js.email === req.body.email && js.password == req.body.password
  );
  if (data.length) {
    res.header("Access-Control-Allow-Origin", "*")
    res.send(data[0]);
  }
  else {
    res.header("Access-Control-Allow-Origin", "*")
    res.status(400).send("User Not Found!")
  }
});

app.get("/users/:id", (req, res) => {
  console.log("nsfesfgu 2222")

  const user = jsonData.find((us) => us.id == req.params.id);
  if (!user) res.status(404).send("the user with given id doesn't exist");
  res.send(user);
});

app.post("/users", (req, res) => {
  console.log("nsfesfgu 1111", req.body)
  const schema = {
    email: Joi.string().required(),
    password: Joi.string().required(),
  };
  const result = Joi.validate(req.body, schema);
  // console.log("first", result)
  if (result.error) {
    res.header("Access-Control-Allow-Origin", "*")
    res.status(400).send("Email and password required");
    return;
  }
  var obj = {
    id: jsonData?.length + 1,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(obj, "obj")
  var payload = [...jsonData, obj];
  fs.writeFileSync("data.json", JSON.stringify(payload), function (err) {
    console.log(err, "error occured in add User");
  });
  res.header("Access-Control-Allow-Origin", "*")
  res.send(obj);
});

app.listen(4000, () => console.log("Listening to port 4000"));
