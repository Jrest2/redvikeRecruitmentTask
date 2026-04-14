export interface AmenityBookingResponse {
  reservationId: string;
  userId: string;
  startTime: string;
  durationMinutes: number;
  amenityName: string;
}

export interface UserBookingRow {
  bookingDay: Date | string;
  reservationId: string;
  amenityId: string;
  amenityName: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
}

export interface UserBookingsByDayResponse {
  date: string;
  reservations: {
    reservationId: string;
    amenityId: string;
    amenityName: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
  }[];
}
