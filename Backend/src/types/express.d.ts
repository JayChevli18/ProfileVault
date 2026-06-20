import type { IUserDocument } from "@/modules/user/user.types";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export {};
