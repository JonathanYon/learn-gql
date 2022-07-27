import jwt from "jsonwebtoken";

export const newToken = (user) => {
    return jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.SECRET,
        { expiresIn: "1h" }
      );
}