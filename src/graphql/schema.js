import gql from "graphql-tag"


const typeDefs = gql`
    type Post {
      id: ID!
      body: String!
      username: String
      createdAt: String!
      user: ID!
      comments: [Comment]!
      likes: [Like]
    }

    type Comment {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }

    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }
    
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String
    }

    type Query {
        getPosts: [Post]
        """
        test comment for getPost
        """
        getPost(postId: ID!): Post
    }
    type Mutation {
        register(registerInput: RegisterInput): User
        login(username: String!, password: String!): User! 
        """
        creating new post based on the body(text for post) and returning the post + the user who posted it
        """
        createPost(body: String): Post!
        deletePost(postId: ID!): String
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
`
export default typeDefs
