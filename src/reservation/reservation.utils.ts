import {
  AmenityBookingResponse,
  UserBookingRow,
  UserBookingsByDayResponse,
} from "./reservation.types";

const pad = (value: number) => value.toString().padStart(2, "0");

export const formatTimeUtc = (value: Date) =>
  `${pad(value.getUTCHours())}:${pad(value.getUTCMinutes())}`;

export const formatDateUtc = (value: Date) =>
  `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`;

export const getDayBounds = (dayIso: string) => {
  const dayStart = new Date(dayIso);
  const dayEnd = new Date(dayStart);

  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  return { dayStart, dayEnd };
};

export const getDurationMinutes = (start: Date, end: Date) =>
  Math.round((end.getTime() - start.getTime()) / 60000);

export const mapAmenityBooking = (reservation: {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  amenity: { name: string };
}): AmenityBookingResponse => ({
  reservationId: reservation.id,
  userId: reservation.userId,
  startTime: formatTimeUtc(reservation.startTime),
  durationMinutes: getDurationMinutes(reservation.startTime, reservation.endTime),
  amenityName: reservation.amenity.name,
});

export const groupUserBookingsByDay = (
  rows: UserBookingRow[],
): UserBookingsByDayResponse[] => {
  const grouped = new Map<string, UserBookingsByDayResponse["reservations"]>();

  for (const row of rows) {
    const bookingDay =
      row.bookingDay instanceof Date
        ? formatDateUtc(row.bookingDay)
        : row.bookingDay;

    const reservations = grouped.get(bookingDay) ?? [];

    reservations.push({
      reservationId: row.reservationId,
      amenityId: row.amenityId,
      amenityName: row.amenityName,
      startTime: formatTimeUtc(row.startTime),
      endTime: formatTimeUtc(row.endTime),
      durationMinutes: Number(row.durationMinutes),
    });

    grouped.set(bookingDay, reservations);
  }

  return Array.from(grouped.entries()).map(([date, reservations]) => ({
    date,
    reservations,
  }));
};
