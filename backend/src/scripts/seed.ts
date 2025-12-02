import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
  });
  
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const passwordHash = await bcrypt.hash('demo1234', saltRounds);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      fullName: 'Demo User',
      passwordHash,
    },
  });

  console.log(`✅ Created demo user: ${demoUser.email} (password: demo1234)`);

  const room1 = await prisma.room.create({
    data: {
      name: 'Deluxe Sea View',
      location: 'tel-aviv',
      capacity: 4,
      pricePerNight: 120,
      currency: 'USD',
      amenities: ['wifi', 'air_conditioning', 'tv'],
    },
  });

  const room2 = await prisma.room.create({
    data: {
      name: 'Business Suite',
      location: 'jerusalem',
      capacity: 2,
      pricePerNight: 90,
      currency: 'USD',
      amenities: ['wifi', 'desk'],
    },
  });

  const room3 = await prisma.room.create({
    data: {
      name: 'Family Room',
      location: 'tel-aviv',
      capacity: 5,
      pricePerNight: 150,
      currency: 'USD',
      amenities: ['wifi', 'air_conditioning'],
    },
  });

  console.log('✅ Created 3 rooms');

  await prisma.booking.create({
    data: {
      userId: demoUser.id,
      roomId: room1.id,
      checkIn: new Date('2025-12-10'),
      checkOut: new Date('2025-12-15'),
      guests: 2,
      status: 'CONFIRMED',
    },
  });

  console.log('✅ Created sample booking for room1 (Deluxe Sea View)');
  console.log('🌱 Seeding finished successfully');
}

main()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
