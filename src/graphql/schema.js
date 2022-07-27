import gql from "graphql-tag"


const typeDefs = gql`
    type Post {
      id: ID!
      body: String!
      username: String
      createdAt: String!
    }
    type Query {
        getPosts: [Post]
    }
`
export default typeDefs
