import {
  PrismaClient,
  RoleName,
  BookingStatus,
  PaymentStatus,
  MovieGenre,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    {
      id: 1,
      name: RoleName.Admin,
    },
    {
      id: 2,
      name: RoleName.User,
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

  const genres = Object.values(MovieGenre).map((genreName) => ({
    name: genreName,
  }));

  const createdGenres = [];
  for (const genre of genres) {
    const createdGenre = await prisma.genre.upsert({
      where: { name: genre.name },
      update: {},
      create: genre,
    });
    createdGenres.push(createdGenre);
    console.log(`Seeding genre: ${genre.name}`);
  }

  const movies = [
    {
      id: 1,
      title: "Avatar: The Way of Water",
      overview:
        "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
      duration: 192,
      genre_ids: [1, 5, 9],
      release_date: new Date("2022-12-16"),
      poster_path:
        "https://image.tmdb.org/t/p/original//t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      popularity: 520159,
      vote_average: 7.4,
    },
    {
      id: 2,
      title: "Oppenheimer",
      overview:
        "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
      duration: 181,
      genre_ids: [2, 17],
      release_date: new Date("2023-07-19"),
      poster_path:
        "https://image.tmdb.org/t/p/original//8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
      popularity: 831221,
      vote_average: 8.1,
    },
    {
      id: 3,
      title: "Spider-Man: Across the Spider-Verse",
      overview:
        "Miles Morales catapults across the multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
      duration: 140,
      genre_ids: [8, 1, 9, 5],
      release_date: new Date("2023-06-02"),
      poster_path:
        "https://image.tmdb.org/t/p/original//8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      popularity: 426420,
      vote_average: 8.3,
    },
  ];

  for (const movie of movies) {
    await prisma.movie.upsert({
      where: { id: movie.id },
      update: {},
      create: movie,
    });
    console.log(`Seeding movie: ${movie.title}`);
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
      movieId: movies[0].id,
      bioskopId: bioskops[0].id,
      studioId: studios[0].id,
      startTime: new Date("2024-01-01T14:00:00Z"),
      endTime: new Date("2024-01-01T16:30:00Z"),
    },
    {
      id: 2,
      movieId: movies[1].id,
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
    console.log(`Seeding showtime for movie: ${showtime.movieId}`);
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
      status: BookingStatus.Confirmed,
      paymentStatus: PaymentStatus.Paid,
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
