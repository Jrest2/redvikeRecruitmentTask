import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { ReservationService } from "./reservation.service";
import { GetAmenityBookingsDto } from "./dto/get-amenity-bookings.dto";

@ApiTags("reservation")
@ApiBearerAuth()
@Controller("reservation")
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: "Create reservation" })
  @ApiResponse({ status: 201, description: "Reservation created successfully" })
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all reservations" })
  @ApiResponse({ status: 200, description: "Reservations fetched successfully" })
  async findAll() {
    return this.reservationService.findAll();
  }

  @Get("amenities/:amenityId/bookings")
  @ApiOperation({ summary: "Get amenity bookings for the selected day" })
  @ApiParam({ name: "amenityId", description: "Amenity id" })
  @ApiQuery({
    name: "day",
    description: "Start of day in ISO-8601 format",
    example: "2026-04-14T00:00:00.000Z",
  })
  @ApiResponse({
    status: 200,
    description: "Amenity bookings fetched successfully",
  })
  async findAmenityBookingsByDay(
    @Param("amenityId") amenityId: string,
    @Query() query: GetAmenityBookingsDto,
  ) {
    return this.reservationService.findAmenityBookingsByDay(amenityId, query.day);
  }

  @Get("users/:userId/bookings")
  @ApiOperation({ summary: "Get user bookings grouped by days" })
  @ApiParam({ name: "userId", description: "User id" })
  @ApiResponse({
    status: 200,
    description: "User bookings grouped by days fetched successfully",
  })
  async findUserBookingsGroupedByDay(@Param("userId") userId: string) {
    return this.reservationService.findUserBookingsGroupedByDay(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get reservation by id" })
  @ApiResponse({ status: 200, description: "Reservation fetched successfully" })
  async findOne(@Param("id") id: string) {
    return this.reservationService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update reservation by id" })
  @ApiResponse({ status: 200, description: "Reservation updated successfully" })
  async update(
    @Param("id") id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete reservation by id" })
  @ApiResponse({ status: 200, description: "Reservation deleted successfully" })
  async remove(@Param("id") id: string) {
    return this.reservationService.remove(id);
  }
}
