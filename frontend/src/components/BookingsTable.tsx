
export interface BookingRow {
  id: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
}

interface BookingsTableProps {
  bookings: BookingRow[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  if (bookings.length === 0) {
    return null;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Booking</th>
          <th>Dates</th>
          <th>Guests</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map(b => (
          <tr key={b.id}>
            <td>{b.roomName}</td>
            <td>
              {new Date(b.checkIn).toLocaleDateString()} &rarr;{' '}
              {new Date(b.checkOut).toLocaleDateString()}
            </td>
            <td>{b.guests}</td>
            <td>{b.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


