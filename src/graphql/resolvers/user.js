import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server";

import userModel from "../../models/user.js";
import { validateRegisterInput } from "../../utils/validators.js";

export const userResolver = {
  Mutation: {
    //args are the registerInput from our typeDefs in the schema
    async register(
      _,
      { registerInput: { email, username, password, confirmPassword } }
    ) {
      try {
        const {errors,valid} = validateRegisterInput(username, email, password, confirmPassword)
        if(!valid){
            throw new UserInputError("Errors", {errors})
        }
        const user = await userModel.findOne({ username });
        if (user) {
          throw new UserInputError("UserName is taken", {
            errors: {
              username: "This username is taken",
            },
          });
        }

        password = await bcrypt.hash(password, 12);
        const newUser = await userModel({
          email,
          username,
          password,
          createdAt: new Date().toISOString(),
        }).save();
        console.log("xxxx>", newUser);
        const token = jwt.sign(
          {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            createdAt: newUser.createdAt,
          },
          process.env.SECRET,
          { expiresIn: "1h" }
        );

        return {
          email,
          username,
          createdAt: newUser.createdAt,
          id: newUser._id,
          token,
        };
      } catch (err) {
        console.log(err);
      }
    },
  },
};
