import { AuthenticationError } from "apollo-server";

import postModel from "../../models/post.js";
import AuthMiddleware from "../../utils/authMidd.js";

export const PostResolver = {
  Query: {
    async getPosts() {
      try {
        const post = await postModel.find().sort({ createdAt: -1 });
        console.log("-->", post);
        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await postModel.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not Found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, ctx) {
      try {
        const user = await AuthMiddleware(ctx);
        // console.log("--+", ctx);
        console.log("---<", user);

        if (user) {
          const newPost = await postModel({
            body,
            user: user._id,
            username: user.username,
            email: user.email,
            createdAt: new Date().toISOString(),
          }).save();
          return newPost;
        } else {
          throw new AuthenticationError("You need to register first");
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    async deletePost(_, { postId }, ctx) {
      try {
        const user = await AuthMiddleware(ctx);
        // console.log("--+", ctx);
        if (user) {
          const post = await postModel.findById(postId);
          if (post) {
            const match = post.user.toString() === user._id.toString();
            if (match) {
              await post.delete();
              return "deleted";
            } else {
              throw new AuthenticationError(
                "NOT Authorized to perform this Action"
              );
            }
          } else {
            throw new Error(`Post ${postId} not found`);
          }
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
