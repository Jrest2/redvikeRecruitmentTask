import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { RequestContextMiddleware } from "./request-context.middleware";

@Module({})
export class MiddlewareModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: "*path", method: RequestMethod.ALL });
  }
}
