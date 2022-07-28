import { userResolver } from "./user.js"
import {PostResolver} from "./post.js"
import { CommentResolver } from "./comments.js"


const resolvers =  {
    Query: {
        ...PostResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...PostResolver.Mutation,
        ...CommentResolver.Mutation
    }
}

export default resolvers