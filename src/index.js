import {ApolloServer} from "apollo-server"
import mongoose from "mongoose"

import typeDefs from "./graphql/schema.js"
import resolvers from "./graphql/resolvers/index.js"



const port = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs, resolvers
})


mongoose.set("debug", true);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("🍃 Successfully connected to mongo!");
  server.listen(port, () => {
    console.log(`server running on:  http://localhost:${port}/`)
    
  });
});

mongoose.connection.on("error", (err) => {
  console.log("MONGO ERROR: ", err);
});



