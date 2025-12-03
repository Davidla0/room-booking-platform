
export interface RoomCardProps {
  name: string;
  location: string;
  capacity: number;
  pricePerNight: number;
  currency: string;
  amenities?: string[];
  actionLabel: string;
  checkIn: string;
  checkOut: string;
  img: string;
  onAction: () => void;
}

export function RoomCard({
  name,
  location,
  capacity,
  pricePerNight,
  currency,
  amenities,
  actionLabel,
  onAction,
  checkIn,
  checkOut,
  img
}: RoomCardProps) {

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const totalPrice = nights * pricePerNight;

  return (
    <div className="room-card">
      {img && (
        <div className="room-image">
          <img
            src={img}
            alt={name}
            style={{
              width: '100%',
              height: 160,
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '12px',
            }}
          />
        </div>
      )}

      <div className="room-name">{name}</div>

      <div className="room-meta">
        {location} • Up to {capacity} guest{capacity > 1 ? 's' : ''}
      </div>

      <div className="room-price">
        {pricePerNight} {currency} / night
      </div>

      <div className="room-total">
        <strong>Total:</strong> {totalPrice} {currency} ({nights} nights)
      </div>

      {amenities && amenities.length > 0 && (
        <div className="room-meta">Amenities: {amenities.join(', ')}</div>
      )}

      <div className="room-actions">
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}



