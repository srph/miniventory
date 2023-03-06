import { prisma } from "../src/server/db";
import { faker } from "@faker-js/faker";

async function main() {
  const brand = await prisma.brand.create({
    data: { name: "Sereese" },
  });

  for (let i = 0; i < 10; i++) {
    await prisma.item.create({
      data: {
        name: faker.commerce.productName(),
        thumbnailUrl: faker.image.imageUrl(),
        quantity: Number(faker.random.numeric(2)),
        originalPrice: Number(faker.random.numeric(2)),
        retailPrice: Number(faker.random.numeric(2)),
        brand: {
          connect: {
            id: brand.id,
          },
        },
      },
    });
  }

  for (let i = 0; i < 5; i++) {
    await prisma.customer.create({
      data: {
        name: faker.name.firstName(),
        thumbnailUrl: faker.image.imageUrl(),
      },
    });
  }
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
