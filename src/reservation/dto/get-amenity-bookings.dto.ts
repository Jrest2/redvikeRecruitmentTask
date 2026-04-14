import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class GetAmenityBookingsDto {
  @ApiProperty({
    description: "Start of the selected day in ISO-8601 format",
    example: "2026-04-14T00:00:00.000Z",
  })
  @IsDateString()
  @IsNotEmpty()
  day: string;
}
