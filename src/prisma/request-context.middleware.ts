import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from "express";
import { setRequestContext } from "./context";
import { RequestWithUser } from "../auth/auth.type";
import { randomUUID } from "crypto";

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: RequestWithUser, res: Response, next: NextFunction) {
    const incomingRequestId = req.headers["x-request-id"];
    const requestId =
      typeof incomingRequestId === "string" && incomingRequestId.length > 0
        ? incomingRequestId
        : randomUUID();

    (req as RequestWithUser & { requestId: string }).requestId = requestId;
    res.setHeader("x-request-id", requestId);

    if (req.user && req.user.id && req.user.email) {
      void setRequestContext(req.user.id, req.user.email, () => {
        next();
      });
    } else {
      next();
    }
  }
}
