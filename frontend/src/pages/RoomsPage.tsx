// src/pages/RoomsPage.tsx
import React, { useState } from 'react';
import { apiFetch, useAuth } from '../auth/AuthContext';

interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
}

interface RoomsResponse {
  items: Room[];
  page: number;
  pageSize: number;
  total: number;
}

export default function RoomsPage() {
  const { token, user } = useAuth();
  const [location, setLocation] = useState('tel-aviv');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [checkIn, setCheckIn] = useState('2025-12-10');
  const [checkOut, setCheckOut] = useState('2025-12-15');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  const searchRooms = async () => {
    setError(null);
    setBookingMessage(null);
    setLoading(true);

    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (capacity) params.append('capacity', String(capacity));
    params.append('checkIn', checkIn);
    params.append('checkOut', checkOut);

    try {
      const data: RoomsResponse = await apiFetch(`/rooms?${params.toString()}`);
      setRooms(data.items);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const bookRoom = async (roomId: string) => {
    if (!token) {
      setBookingMessage('You must be logged in to book a room');
      return;
    }

    setBookingMessage(null);
    try {
      await apiFetch(
        '/bookings',
        {
          method: 'POST',
          body: JSON.stringify({
            roomId,
            checkIn,
            checkOut,
            guests: capacity || 1,
          }),
        },
        token,
      );
      setBookingMessage('Booking created successfully');
      await searchRooms();
    } catch (err: any) {
      setBookingMessage(err.message || 'Failed to create booking');
    }
  };

  return (
    <div>
      <h2>Search Rooms</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="location (e.g. tel-aviv)"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="guests / capacity"
          value={capacity}
          onChange={e => setCapacity(e.target.value ? Number(e.target.value) : '')}
        />
        <input
          type="date"
          value={checkIn}
          onChange={e => setCheckIn(e.target.value)}
        />
        <input
          type="date"
          value={checkOut}
          onChange={e => setCheckOut(e.target.value)}
        />
        <button onClick={searchRooms} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {bookingMessage && <div style={{ marginBottom: '1rem' }}>{bookingMessage}</div>}

      {rooms.length === 0 && !loading && <div>No rooms found for this criteria.</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {rooms.map(room => (
          <div
            key={room.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '0.75rem',
            }}
          >
            <h3>{room.name}</h3>
            <p>
              Location: {room.location} | Capacity: {room.capacity}
            </p>
            <p>
              Price: {room.pricePerNight} {room.currency} per night
            </p>
            {room.amenities?.length > 0 && (
              <p>Amenities: {room.amenities.join(', ')}</p>
            )}

            <button onClick={() => bookRoom(room.id)} disabled={!user}>
              {user ? 'Book this room' : 'Login to book'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
