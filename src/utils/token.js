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

export const verifyToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    })
  );