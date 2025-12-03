import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiFetch, useAuth } from '../auth/AuthContext';
import { PagePanel } from '../components/PagePanel';
import { RoomCard } from '../components/RoomCard';

interface Room {
id: string;
name: string;
location: string;
capacity: number;
pricePerNight: number;
currency: string;
amenities: string[];
imageUrl: string
}

interface RoomsResponse {
items: Room[];
page: number;
pageSize: number;
total: number;
}

type SearchOverrides = {
location?: string;
capacity?: number | '';
checkIn?: string;
checkOut?: string;
};

function formatDate(d: Date) {
    return d.toISOString().split("T")[0];
}

export default function RoomsPage() {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();
    const routerLocation = useLocation();

    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState<number | ''>('');
    const [checkIn, setCheckIn] = useState(formatDate(new Date()));
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [checkOut, setCheckOut] = useState(formatDate(tomorrow));
    const [rooms, setRooms] = useState<Room[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingMessage, setBookingMessage] = useState<string | null>(null);

    const hasResults = rooms.length > 0;

    const searchRooms = async (overrides?: SearchOverrides) => {
        setLoading(true);
        setError(null);
        setBookingMessage(null);

        const effectiveLocation = overrides?.location ?? location;
        const effectiveCapacity = overrides?.capacity ?? capacity;
        const effectiveCheckIn = overrides?.checkIn ?? checkIn;
        const effectiveCheckOut = overrides?.checkOut ?? checkOut;

        const params = new URLSearchParams();
        if (effectiveLocation) params.append('location', effectiveLocation);
        if (effectiveCapacity) params.append('capacity', String(effectiveCapacity));
        params.append('checkIn', effectiveCheckIn);
        params.append('checkOut', effectiveCheckOut);

        try {
        const data: RoomsResponse = await apiFetch(`/rooms?${params.toString()}`);
        setRooms(data.items);
        } catch (err: any) {
            const msg = err?.message || 'Failed to fetch rooms';

        if (msg.toLowerCase().includes('invalid or expired token')) {
            logout();
            setError('Your session has expired. Please log in again.');
            return;
        }
        setError(msg);
        } finally {
        setLoading(false);
        }
    };

    const bookRoom = async (roomId: string) => {
        if (!token) {
        setBookingMessage('You must be logged in to book a room');
        return;
        }

        setError(null);

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

        await searchRooms();
        setBookingMessage('✅ Booking created successfully');
        } catch (err: any) {
            const msg = err?.message || 'Failed to create booking';

            if (msg.toLowerCase().includes('invalid or expired token')) {
                logout();
                setError('Your session has expired. Please log in again.');
                return;
            }
            setBookingMessage(msg);
        }
    };

    useEffect(() => {
        if (!token) return;

        const raw = sessionStorage.getItem('roomsSearchState');
        if (!raw) return;

        const saved = JSON.parse(raw) as SearchOverrides;

        if (saved.location) setLocation(saved.location);
        if (typeof saved.capacity !== 'undefined') setCapacity(saved.capacity);
        if (saved.checkIn) setCheckIn(saved.checkIn);
        if (saved.checkOut) setCheckOut(saved.checkOut);

        (async () => {
        try {
            await searchRooms(saved);
        } finally {
            sessionStorage.removeItem('roomsSearchState');
        }
        })();
    }, [token]);

    useEffect(() => {

        (async () => {
            const params = new URLSearchParams();
            params.append('checkIn', checkIn);
            params.append('checkOut', checkOut);

            const data: RoomsResponse = await apiFetch(`/rooms?${params.toString()}`);
            setRooms(data.items);
        })();

        if (!bookingMessage) return;
    
        const timer = setTimeout(() => {
        setBookingMessage(null);
        }, 3000); 
    
        return () => clearTimeout(timer);
    }, [bookingMessage]);


    return (
        <PagePanel
        title="Find your next room"
        subtitle="Search by location, dates and capacity to see what's available."
        rightMeta={
            hasResults ? (
            <>
                Showing <strong>{rooms.length}</strong> room
                {rooms.length > 1 ? 's' : ''} for your dates
            </>
            ) : null
        }
        >
        <div className="form-grid">
            <div className="field">
            <label htmlFor="location">Location</label>
            <input
                id="location"
                type="text"
                placeholder="e.g. Tel-Aviv"
                value={location}
                onChange={e => setLocation(e.target.value)}
            />
            </div>

            <div className="field">
            <label htmlFor="capacity">Guests</label>
            <input
                id="capacity"
                type="number"
                placeholder="Guests / capacity"
                value={capacity}
                min={1}
                onChange={e => setCapacity(e.target.value ? Number(e.target.value) : '')}
            />
            </div>

            <div className="field">
            <label htmlFor="checkIn">Check-in</label>
            <input
                id="checkIn"
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
            />
            </div>

            <div className="field">
            <label htmlFor="checkOut">Check-out</label>
            <input
                id="checkOut"
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
            />
            </div>

            <div className="field">
            <label>&nbsp;</label>
            <button
                className="btn btn-primary"
                onClick={() => searchRooms()}
                disabled={loading}
            >
                {loading ? 'Searching…' : 'Search rooms'}
            </button>
            </div>
        </div>

        {loading && (
            <div className="panel" style={{ marginTop: 8 }}>
            <p>🔄 Searching rooms...</p>
            </div>
        )}

        {!loading && error && (
            <div
            className="panel"
            style={{ marginTop: 8, borderColor: '#ef4444' }}
            >
            <p style={{ color: '#ef4444', fontSize: 13 }}>{error}</p>
            </div>
        )}

        {!loading && bookingMessage && (
            <div
            className="panel"
            style={{
                marginTop: 8,
                borderColor: bookingMessage.startsWith('❌') ? '#ef4444' : '#22c55e',
            }}
            >
            <p
                style={{
                color: bookingMessage.startsWith('❌') ? '#ef4444' : '#22c55e',
                fontSize: 13,
                }}
            >
                {bookingMessage}
            </p>
            </div>
        )}

        {!hasResults && !loading && !error && (
            <div className="empty-state">
            No rooms found for this criteria yet. Try another location, adjust your
            dates or capacity.
            </div>
        )}

        {hasResults && (
            <div className="rooms-grid">
            {rooms.map(room => (
                    <RoomCard
                    key={room.id}
                    name={room.name}
                    location={room.location}
                    capacity={room.capacity}
                    pricePerNight={room.pricePerNight}
                    currency={room.currency}
                    amenities={room.amenities}
                    img={room.imageUrl}
                    actionLabel={user ? 'Book this room' : 'Login to book'}
                    checkIn = {checkIn}
                    checkOut = {checkOut}
                    onAction={() => {
                        if (!user) {
                        sessionStorage.setItem(
                            'roomsSearchState',
                            JSON.stringify({
                            location,
                            capacity,
                            checkIn,
                            checkOut,
                            }),
                        );

                        navigate('/login', { state: { from: routerLocation.pathname } });
                        return;
                        }
                        bookRoom(room.id);
                    }}
                    />
            ))}
            </div>
        )}
        </PagePanel>
    );
}
