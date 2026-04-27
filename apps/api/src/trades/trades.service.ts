import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { db } from '@thirdleaf/db';
import { trades as tradesTable } from '@thirdleaf/db';
import { eq, and, desc } from 'drizzle-orm';
import { BrokerParserFactory } from './parsers/broker-parser.factory';

@Injectable()
export class TradesService {
  private readonly logger = new Logger(TradesService.name);

  constructor(private readonly parserFactory: BrokerParserFactory) {}

  async findAll(userId: string, page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;
    const data = await db.select().from(tradesTable)
      .where(eq(tradesTable.userId, userId))
      .orderBy(desc(tradesTable.entryTime))
      .limit(limit)
      .offset(offset);
    return { data, page, limit };
  }

  async importFromCsv(userId: string, broker: string, csvBuffer: Buffer) {
    try {
      const csvData = csvBuffer.toString();
      const rawRecords: any[] = this.parserFactory.parseCsv(csvData);

      // Sort by execution time to ensure pairing works
      rawRecords.sort((a: any, b: any) => 
        new Date(a.order_execution_time || a.time).getTime() - 
        new Date(b.order_execution_time || b.time).getTime()
      );

      this.logger.log(`Importing ${rawRecords.length} records for user ${userId}`);
      
      // Minimal pairing logic (placeholder for actual implementation)
      const newTradesCount = 0;
      
      return { success: true, count: newTradesCount };
    } catch (error: any) {
      throw new BadRequestException(`Import error: ${error.message}`);
    }
  }
}
