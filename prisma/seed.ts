import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const host = await prisma.user.upsert({
    where: { email: "hote@example.com" },
    update: {},
    create: {
      email: "hote@example.com",
      name: "Alice Hôte",
      passwordHash,
      role: "HOST",
    },
  });

  const guest = await prisma.user.upsert({
    where: { email: "voyageur@example.com" },
    update: {},
    create: {
      email: "voyageur@example.com",
      name: "Bob Voyageur",
      passwordHash,
      role: "GUEST",
    },
  });

  const count = await prisma.listing.count({ where: { ownerId: host.id } });
  if (count === 0) {
    await prisma.listing.create({
      data: {
        title: "Studio lumineux centre-ville",
        description:
          "Petit studio calme, idéal pour un week-end. Wi‑Fi, cuisine équipée.",
        city: "Paris",
        pricePerNight: 89,
        ownerId: host.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
              order: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
              order: 1,
            },
          ],
        },
      },
    });

    await prisma.listing.create({
      data: {
        title: "Maison avec jardin",
        description: "Maison familiale, jardin clos, parking.",
        city: "Lyon",
        pricePerNight: 145,
        ownerId: host.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
              order: 0,
            },
          ],
        },
      },
    });
  }

  console.log("Seed OK:", { host: host.email, guest: guest.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
