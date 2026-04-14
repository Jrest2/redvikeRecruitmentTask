import { Module } from "@nestjs/common";
import { AmenityController } from "./amenity.controller";
import { AmenityService } from "./amenity.service";

@Module({
  imports: [],
  controllers: [AmenityController],
  providers: [AmenityService],
  exports: [AmenityService],
})
export class AmenityModule {}
