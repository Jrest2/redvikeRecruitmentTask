import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateReservationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  amenityId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}
