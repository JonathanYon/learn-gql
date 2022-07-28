import bcrypt from "bcrypt";
import { UserInputError } from "apollo-server";

import userModel from "../../models/user.js";
import { validateRegisterInput, validateLoginInput } from "../../utils/validators.js";
import { newToken } from "../../utils/token.js";

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
        const token = newToken(newUser)

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
    async login(_, {username, password}){
        try {
            const {errors, valid} = validateLoginInput(username, password)
            const user = await userModel.findOne({username})

            if(!valid){
                throw new UserInputError("Error", {errors})
            } else {
                if(!user){
                    errors.general = "User not Found";
                    throw new UserInputError('User not Found', {errors})
                } else {
                    const match = await bcrypt.compare(password, user.password)
                    if(!match){
                        errors.general = "User not Found";
                        throw new UserInputError('Wrong credential', {errors})
                    } else {
                        const token = newToken(user)
                        return {
                            token,
                            id: user._id,
                            email: user.email,
                            username: user.username,
                            createdAt: user.createdAt
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err)
        }
    },
    
  },
};
