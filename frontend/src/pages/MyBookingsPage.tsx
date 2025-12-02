// src/pages/MyBookingsPage.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch, useAuth } from '../auth/AuthContext';

interface Booking {
  id: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
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
    return <div>You must be logged in to see your bookings.</div>;
  }

  return (
    <div>
      <h2>My Bookings</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {bookings.length === 0 && !loading && <div>No bookings yet.</div>}

      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {bookings.map(b => (
          <li
            key={b.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '0.75rem',
              marginBottom: '0.5rem',
            }}
          >
            <p>Booking ID: {b.id}</p>
            <p>Room ID: {b.roomId}</p>
            <p>
              {new Date(b.checkIn).toLocaleDateString()} →{' '}
              {new Date(b.checkOut).toLocaleDateString()}
            </p>
            <p>Guests: {b.guests}</p>
            <p>Status: {b.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
