import {
  formatDateUtc,
  formatTimeUtc,
  getDayBounds,
  getDurationMinutes,
  groupUserBookingsByDay,
  mapAmenityBooking,
} from "./reservation.utils";

describe("reservation utils", () => {
  it("builds UTC day bounds", () => {
    const { dayStart, dayEnd } = getDayBounds("2026-04-14T00:00:00.000Z");

    expect(dayStart.toISOString()).toBe("2026-04-14T00:00:00.000Z");
    expect(dayEnd.toISOString()).toBe("2026-04-15T00:00:00.000Z");
  });

  it("formats time and date in UTC", () => {
    const date = new Date("2026-04-14T09:05:00.000Z");

    expect(formatTimeUtc(date)).toBe("09:05");
    expect(formatDateUtc(date)).toBe("2026-04-14");
  });

  it("calculates duration in minutes", () => {
    expect(
      getDurationMinutes(
        new Date("2026-04-14T09:00:00.000Z"),
        new Date("2026-04-14T10:30:00.000Z"),
      ),
    ).toBe(90);
  });

  it("maps amenity booking response", () => {
    expect(
      mapAmenityBooking({
        id: "reservation-1",
        userId: "user-1",
        startTime: new Date("2026-04-14T09:00:00.000Z"),
        endTime: new Date("2026-04-14T10:00:00.000Z"),
        amenity: { name: "Conference room" },
      }),
    ).toEqual({
      reservationId: "reservation-1",
      userId: "user-1",
      startTime: "09:00",
      durationMinutes: 60,
      amenityName: "Conference room",
    });
  });

  it("groups user bookings by day", () => {
    const result = groupUserBookingsByDay([
      {
        bookingDay: "2026-04-14",
        reservationId: "r1",
        amenityId: "a1",
        amenityName: "Room A",
        startTime: new Date("2026-04-14T09:00:00.000Z"),
        endTime: new Date("2026-04-14T10:00:00.000Z"),
        durationMinutes: 60,
      },
      {
        bookingDay: "2026-04-15",
        reservationId: "r2",
        amenityId: "a2",
        amenityName: "Room B",
        startTime: new Date("2026-04-15T11:00:00.000Z"),
        endTime: new Date("2026-04-15T12:30:00.000Z"),
        durationMinutes: 90,
      },
    ]);

    expect(result).toEqual([
      {
        date: "2026-04-14",
        reservations: [
          {
            reservationId: "r1",
            amenityId: "a1",
            amenityName: "Room A",
            startTime: "09:00",
            endTime: "10:00",
            durationMinutes: 60,
          },
        ],
      },
      {
        date: "2026-04-15",
        reservations: [
          {
            reservationId: "r2",
            amenityId: "a2",
            amenityName: "Room B",
            startTime: "11:00",
            endTime: "12:30",
            durationMinutes: 90,
          },
        ],
      },
    ]);
  });
});
