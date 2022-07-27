import { userResolver } from "./user.js"
import {PostResolver} from "./post.js"


const resolvers =  {
    Query: {
        ...PostResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation
    }
}

export default resolvers