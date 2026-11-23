import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { DayOfWeek, PrismaClient } from '../src/generated/prisma/client';
import dayjs = require('dayjs');
import utc = require('dayjs/plugin/utc');
import timezonePlugin = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const testUser1 = await prisma.user.upsert({
    where: { id: '4df172bd-d5ce-4a83-82d6-156bb77ca490' },
    update: {},
    create: {
      id: '4df172bd-d5ce-4a83-82d6-156bb77ca490',
      name: 'Test01',
      timezone: 'Asia/Seoul',
    },
  });

  await prisma.user.upsert({
    where: { id: '924e8167-7e96-4956-bd69-b3cdc047d5dd' },
    update: {},
    create: {
      id: '924e8167-7e96-4956-bd69-b3cdc047d5dd',
      name: 'Test02',
      timezone: 'America/New_York',
    },
  });

  const timezone = 'Asia/Seoul';
  const today = dayjs().tz(timezone);
  const testYoasobi1Date = today
    .add(2, 'day')
    .hour(3)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate();
  const testYoasobi2Date = today
    .add(-3, 'day')
    .hour(3)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate();

  const testWeekStartDate1 = dayjs(testYoasobi1Date)
    .tz(timezone)
    .startOf('week')
    .toDate();

  const testWeekStartDate2 = dayjs(testYoasobi2Date)
    .tz(timezone)
    .startOf('week')
    .toDate();

  const dayOfWeek = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
  ];

  const testDayOfWeek1 = dayOfWeek[dayjs(testYoasobi1Date).tz(timezone).day()];
  const testDayOfWeek2 = dayOfWeek[dayjs(testYoasobi2Date).tz(timezone).day()];

  await prisma.yoasobi.upsert({
    where: {
      userId_weekStartDate: {
        userId: testUser1.id,
        weekStartDate: testWeekStartDate1,
      },
    },
    update: {
      dayOfWeek: testDayOfWeek1,
      yoasobiDate: testYoasobi1Date,
      alarmTime: testYoasobi1Date,
    },
    create: {
      userId: testUser1.id,
      dayOfWeek: testDayOfWeek1,
      yoasobiDate: testYoasobi1Date,
      weekStartDate: testWeekStartDate1,
      alarmTime: testYoasobi1Date,
      duration: 120,
    },
  });

  const testYoasobi2 = await prisma.yoasobi.upsert({
    where: {
      userId_weekStartDate: {
        userId: testUser1.id,
        weekStartDate: testWeekStartDate2,
      },
    },
    update: {},
    create: {
      userId: testUser1.id,
      dayOfWeek: testDayOfWeek2,
      yoasobiDate: testYoasobi2Date,
      weekStartDate: testWeekStartDate2,
      alarmTime: testYoasobi2Date,
      duration: 90,
    },
  });

  // await prisma.history.upsert({
  //   where: { yoasobiId: testYoasobi1.id },
  //   update: {},
  //   create: {
  //     yoasobiId: testYoasobi1.id,
  //     userId: testUser1.id,
  //     note: '오늘 밤도 즐거운 밤산책이었다!',
  //     image: [],
  //   },
  // });

  await prisma.history.upsert({
    where: { yoasobiId: testYoasobi2.id },
    update: {},
    create: {
      yoasobiId: testYoasobi2.id,
      userId: testUser1.id,
      note: '오늘 밤도 즐거운 밤산책이었다!',
      image: [],
    },
  });

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
