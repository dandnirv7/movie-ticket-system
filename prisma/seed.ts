import {
  PrismaClient,
  RoleName,
  BookingStatus,
  PaymentStatus,
  FilmGenre,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      id: 1,
      name: RoleName.ADMIN,
    },
    {
      id: 2,
      name: RoleName.USER,
    },
  ];

  for (const role of roles) {
    console.log(`Seeding role: ${role.name} (ID: ${role.id})`);
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    });
  }

  const users = [
    {
      id: crypto.randomUUID(),
      username: "Admin",
      fullName: "Admin",
      email: "admin@example.com",
      password: "admin5432",
      roleId: 1,
    },
    {
      id: crypto.randomUUID(),
      username: "johndoe",
      fullName: "John Doe",
      email: "johndoe@example.com",
      password: "johndoe123",
      roleId: 2,
    },
    {
      id: crypto.randomUUID(),
      username: "janedoe",
      fullName: "Jane Doe",
      email: "janedoe@example.com",
      password: "janedoe123",
      roleId: 2,
    },
  ];

  const createdUsers = [];
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        password: hashedPassword,
        roleId: user.roleId,
      },
    });
    createdUsers.push(createdUser);
    console.log(`Seeding user: ${user.username} (Email: ${user.email})`);
  }

  const films = [
    {
      id: 1,
      title: "Avatar: The Way of Water",
      description: "The epic sequel to Avatar",
      duration: 192,
      genre: FilmGenre.SCI_FI,
      releaseDate: new Date("2022-12-16"),
    },
    {
      id: 2,
      title: "Oppenheimer",
      description: "A dramatic biopic about J. Robert Oppenheimer",
      duration: 180,
      genre: FilmGenre.DRAMA,
      releaseDate: new Date("2023-07-21"),
    },
    {
      id: 3,
      title: "Spider-Man: Across the Spider-Verse",
      description: "The animated adventure of Miles Morales continues",
      duration: 140,
      genre: FilmGenre.ANIMATION,
      releaseDate: new Date("2023-06-02"),
    },
  ];

  for (const film of films) {
    await prisma.film.upsert({
      where: { id: film.id },
      update: {},
      create: film,
    });
    console.log(`Seeding film: ${film.title}`);
  }

  const bioskops = [
    {
      id: 1,
      name: "Cinema XXI",
      location: "Jakarta",
    },
    {
      id: 2,
      name: "CGV",
      location: "Bandung",
    },
  ];

  for (const bioskop of bioskops) {
    await prisma.bioskop.upsert({
      where: { id: bioskop.id },
      update: {},
      create: bioskop,
    });
    console.log(`Seeding bioskop: ${bioskop.name}`);
  }

  const studios = [
    {
      id: 1,
      bioskopId: bioskops[0].id,
      studioName: "studio 1",
      seatLayout: { rows: 5, columns: 10 },
    },
    {
      id: 2,
      bioskopId: bioskops[1].id,
      studioName: "studio 2",
      seatLayout: { rows: 6, columns: 12 },
    },
  ];

  for (const studio of studios) {
    await prisma.studio.upsert({
      where: { id: studio.id },
      update: {},
      create: studio,
    });
    console.log(`Seeding studio: ${studio.studioName}`);
  }

  const showtimes = [
    {
      id: 1,
      filmId: films[0].id,
      bioskopId: bioskops[0].id,
      studioId: studios[0].id,
      startTime: new Date("2024-01-01T14:00:00Z"),
      endTime: new Date("2024-01-01T16:30:00Z"),
    },
    {
      id: 2,
      filmId: films[1].id,
      bioskopId: bioskops[1].id,
      studioId: studios[1].id,
      startTime: new Date("2024-01-01T17:00:00Z"),
      endTime: new Date("2024-01-01T19:55:00Z"),
    },
  ];

  for (const showtime of showtimes) {
    await prisma.showtime.upsert({
      where: { id: showtime.id },
      update: {},
      create: showtime,
    });
    console.log(`Seeding showtime for film: ${showtime.filmId}`);
  }

  const seats = Array.from({ length: 10 }, (_, i) => ({
    id: 1,
    showtimeId: showtimes[0].id,
    seatNumber: `A${i + 1}`,
  }));

  for (const seat of seats) {
    await prisma.seat.upsert({
      where: { id: seat.id },
      update: {},
      create: seat,
    });
    console.log(`Seeding seat: ${seat.seatNumber}`);
  }

  const bookings = [
    {
      id: 1,
      userId: createdUsers[1].id,
      showtimeId: showtimes[0].id,
      seatId: seats[0].id,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
    },
  ];

  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {},
      create: booking,
    });
    console.log(`Seeding booking for user: ${booking.userId}`);
  }
}

main()
  .then(async () => {
    console.log("Seeding finished successfully!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding data:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
