import { useEffect, useState } from 'react';
import { apiFetch, useAuth } from '../auth/AuthContext';
import { PagePanel } from '../components/PagePanel';
import { BookingsTable } from '../components/BookingsTable';

interface Booking {
  id: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  room?: {
    name: string;
    location: string;
  };
}

interface BookingResponse {
    items: Booking[];
    total: number;
  }

export default function MyBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: BookingResponse = await apiFetch('/bookings/my', {}, token);
        setBookings(data.items);
      } catch (err: any) {
        setError(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (!token) {
    return (
      <PagePanel
        title="My bookings"
        subtitle="Sign in to view and manage all of your room reservations."
      >
        <div className="empty-state">You must be logged in to see your bookings.</div>
      </PagePanel>
    );
  }

  return (
    <PagePanel
      title="My bookings"
      subtitle="See all your upcoming and past reservations in one place."
      rightMeta={
        bookings.length > 0 ? (
          <>
            Total{' '}
            <strong>
              {bookings.length} booking{bookings.length > 1 ? 's' : ''}
            </strong>
          </>
        ) : null
      }
    >
      {loading && <div className="empty-state">Loading your bookings…</div>}
      {error && (
        <div
          style={{
            marginTop: '8px',
            marginBottom: '4px',
            fontSize: '13px',
            color: 'var(--danger)',
          }}
        >
          {error}
        </div>
      )}

      {!loading && bookings.length === 0 && !error && (
        <div className="empty-state">You don&apos;t have any bookings yet.</div>
      )}

      {!loading && bookings.length > 0 && (
        <BookingsTable
          bookings={bookings.map(b => ({
            id: b.id,
            roomName: b.room?.name ?? b.roomId,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            guests: b.guests,
            status: b.status,
          }))}
        />
      )}
    </PagePanel>
  );
}
