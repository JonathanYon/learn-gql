import { AuthenticationError } from "apollo-server";

import { verifyToken } from "./token.js";
import userModel from "../models/user.js";

const AuthMiddleware = async (context) => {
  try {
    const authHeaders = context.req.headers.authorization;
    if (authHeaders) {
        const token = authHeaders.split("Bearer ")[1];
        // console.log("Token---", token);
      const decode = await verifyToken(token);
        // const decode = jwt.verify(token, process.env.SECRET)
        const user = await userModel.findById(decode.id);
        // console.log("decode---", user);
      if (user) {
        return user;
      } else {
        throw new AuthenticationError("Invalid/Expired Token");
      }
    } else {
      throw new Error("Unauthorized User");
    }
  } catch (err) {
    throw new Error(err);
  }
};
export default AuthMiddleware;
