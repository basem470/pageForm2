import crypto from "crypto";

export const idGenerator = () => {
  return crypto.randomBytes(20).toString("hex");
};
