import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.upsert({
    where: { id: '4df172bd-d5ce-4a83-82d6-156bb77ca490' },
    update: {},
    create: {
      id: '4df172bd-d5ce-4a83-82d6-156bb77ca490',
      name: 'Test01',
      timezone: 'Asia/Seoul',
    },
  });

  // await prisma.user.upsert({
  //   where: { id: '00000000-0000-0000-0000-000000000002' },
  //   update: {},
  //   create: {
  //     id: '00000000-0000-0000-0000-000000000002',
  //     name: 'Test02',
  //     timezone: 'Asia/Tokyo',
  //   },
  // });

  // const yoasobi1 = await prisma.yoasobi.upsert({
  //   where: {
  //     userId_weekStartDate: {
  //       userId: user1.id,
  //       weekStartDate: new Date('2026-04-06T15:00:00.000Z'),
  //     },
  //   },
  //   update: {},
  //   create: {
  //     id: '10000000-0000-0000-0000-000000000001',
  //     userId: user1.id,
  //     dayOfWeek: DayOfWeek.FRIDAY,
  //     yoasobiDate: new Date('2026-04-11T14:00:00.000Z'),
  //     weekStartDate: new Date('2026-04-06T15:00:00.000Z'),
  //     alarmTime: new Date('2026-04-11T14:00:00.000Z'),
  //     duration: 120,
  //   },
  // });

  // await prisma.yoasobi.upsert({
  //   where: {
  //     userId_weekStartDate: {
  //       userId: user2.id,
  //       weekStartDate: new Date('2026-04-06T15:00:00.000Z'),
  //     },
  //   },
  //   update: {},
  //   create: {
  //     id: '10000000-0000-0000-0000-000000000002',
  //     userId: user2.id,
  //     dayOfWeek: DayOfWeek.SATURDAY,
  //     yoasobiDate: new Date('2026-04-12T13:00:00.000Z'),
  //     weekStartDate: new Date('2026-04-06T15:00:00.000Z'),
  //     alarmTime: new Date('2026-04-12T13:00:00.000Z'),
  //     duration: 90,
  //   },
  // });

  // await prisma.history.upsert({
  //   where: { yoasobiId: yoasobi1.id },
  //   update: {},
  //   create: {
  //     id: '20000000-0000-0000-0000-000000000001',
  //     yoasobiId: yoasobi1.id,
  //     userId: user1.id,
  //     note: '오늘 밤도 즐거운 야소비였다!',
  //     image: [],
  //   },
  // });

  console.log('Seed completed.');
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
