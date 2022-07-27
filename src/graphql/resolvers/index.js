
import {PostResolver} from "./post.js"


const resolvers =  {
    Query: {
        ...PostResolver.Query
    }
}

export default resolvers