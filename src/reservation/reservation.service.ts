import { Injectable, NotFoundException } from "@nestjs/common";
import { prisma } from "../prisma/prisma.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { Prisma } from "../../generated/prisma/client";
import {
  getDayBounds,
  groupUserBookingsByDay,
  mapAmenityBooking,
} from "./reservation.utils";

@Injectable()
export class ReservationService {
  constructor() {}

  async create(createReservationDto: CreateReservationDto) {
    return prisma.reservation.create({
      data: createReservationDto,
      include: {
        amenity: true,
        user: true,
      },
    });
  }

  async findAll() {
    return prisma.reservation.findMany({
      include: {
        amenity: true,
        user: true,
      },
    });
  }

  async findAmenityBookingsByDay(amenityId: string, day: string) {
    const { dayStart, dayEnd } = getDayBounds(day);

    const reservations = await prisma.reservation.findMany({
      where: {
        amenityId,
        startTime: {
          lt: dayEnd,
        },
        endTime: {
          gte: dayStart,
        },
      },
      include: {
        amenity: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return reservations.map(mapAmenityBooking);
  }

  async findUserBookingsGroupedByDay(userId: string) {
    const rows = await prisma.$queryRaw<
      {
        bookingDay: Date | string;
        reservationId: string;
        amenityId: string;
        amenityName: string;
        startTime: Date;
        endTime: Date;
        durationMinutes: number;
      }[]
    >(Prisma.sql`
      SELECT
        DATE(r.start_time) AS "bookingDay",
        r.id AS "reservationId",
        r.amenity_id AS "amenityId",
        a.name AS "amenityName",
        r.start_time AS "startTime",
        r.end_time AS "endTime",
        EXTRACT(EPOCH FROM (r.end_time - r.start_time)) / 60 AS "durationMinutes"
      FROM "reservation" r
      INNER JOIN "Amenity" a ON a.id = r.amenity_id
      WHERE r.user_id = ${userId}
      ORDER BY DATE(r.start_time), r.start_time
    `);

    return groupUserBookingsByDay(rows);
  }

  async findOne(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        amenity: true,
        user: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }

    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    await this.findOne(id);

    return prisma.reservation.update({
      where: { id },
      data: updateReservationDto,
      include: {
        amenity: true,
        user: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return prisma.reservation.delete({
      where: { id },
      include: {
        amenity: true,
        user: true,
      },
    });
  }
}
