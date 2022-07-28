import { AuthenticationError, UserInputError } from "apollo-server";

import postModel from "../../models/post.js";
import AuthMiddleware from "../../utils/authMidd.js";

export const CommentResolver = {
  Mutation: {
    createComment: async (_, { postId, body }, ctx) => {
      try {
        const user = await AuthMiddleware(ctx);
        if (user) {
          const post = await postModel.findById(postId);
          if (post) {
            if (body.trim() === "") {
              throw new UserInputError("Please write your comment", {
                errors: { body: "comment body must not be empty" },
              });
            } else {
              //  await postModel.findByIdAndUpdate(
              //     postId,
              //     {
              //       $push: {
              //         comments: { body, username: user.username, createdAt: new Date().toISOString() },
              //       },
              //     },
              //     { new: true }
              //   ).sort({createdAt: -1});
              //another alternative of adding a comment to the post
              post.comments.unshift({
                body,
                username: user.username,
                createdAt: new Date().toISOString(),
              });
              await post.save();
              return post;
            }
          } else {
            throw new Error(`Post ${postId} not found`);
          }
        } else {
          throw new AuthenticationError("Authentication Error");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteComment: async (_, { postId, commentId }, ctx) => {
      try {
        const user = await AuthMiddleware(ctx);
        if (user) {
          const post = await postModel.findById(postId);
          if (post) {
            // const comment = post.comments.findIndex(comment => comment._id.toString() === commentId)
            
            // if (comment){
            // post.comments.splice(comment, 1)
            
            //  await post.save()
            //  return post
            // }else{
            //     throw new Error("Comment not found")
            // }

            //or ==>

            const comment = await postModel.findOneAndUpdate(
              {
                comments: {
                  $elemMatch: { _id: commentId },
                },
              },
              {
                $pull: {
                  comments: { _id: commentId },
                },
              }, {new: true}
            );
            console.log('commeny--', comment);
            if(comment){
                return post
            }else {
                throw new Error("comment not found")
            }
          } else {
            throw new Error(`post ${postId} not found`);
          }
        } else {
          throw new AuthenticationError("Authentication Error");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
