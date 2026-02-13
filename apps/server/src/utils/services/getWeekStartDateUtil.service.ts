import { Injectable } from '@nestjs/common';

@Injectable()
export class GetWeekStartDateUtilService {
  execute(date: Date): { weekStartDate: Date } {
    const weekStartDate = new Date(date);
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
    weekStartDate.setHours(0, 0, 0, 0);
    return { weekStartDate };
  }
}
