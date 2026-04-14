import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { MiddlewareModule } from "./prisma/middleware.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ReservationModule } from "./reservation/reservation.module";
import { AmenityModule } from "./amenity/amenity.module";
import { CsvModule } from "./csv/csv.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MiddlewareModule,
    AuthModule,
    UserModule,
    ReservationModule,
    AmenityModule,
    CsvModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
