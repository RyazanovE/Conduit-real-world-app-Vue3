const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.tag.create({
    data: {
      name: 'test@example.com',
    },
  });
  console.log("Данные успешно добавлены");
}

main()
  .catch(e => {
    console.error("Ошибка при заполнении данных:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });