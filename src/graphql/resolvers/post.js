import posts from "../../models/post.js"

export const PostResolver = {
    Query: {
        async getPosts(){
          try {
            const post = await posts.find()
            console.log('-->',post)
            return post
          } catch (error) {
            throw new Error(error)
          }
        }
    }
}