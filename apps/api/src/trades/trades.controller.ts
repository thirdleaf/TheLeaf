import { 
  Controller, Post, Get, Body, Param, Query, 
  UseInterceptors, UploadedFile, UseGuards, Req, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TradesService } from './trades.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { BrokerParserFactory } from './parsers/broker-parser.factory';
import { Request } from 'express';

@Controller('trades')
@UseGuards(ClerkGuard)
export class TradesController {
  constructor(
    private readonly tradesService: TradesService,
    private readonly parserFactory: BrokerParserFactory,
  ) {}

  @Get()
  async getTrades(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    const userId = req.clerkUserId;
    if (!userId) throw new Error('UserId missing');
    return this.tradesService.findAll(userId, page, limit);
  }

  @Post('import/:broker')
  @UseInterceptors(FileInterceptor('file'))
  async importTrades(
    @Param('broker') broker: string,
    @UploadedFile() file: any,
    @Req() req: Request,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const userId = req.clerkUserId;
    if (!userId) throw new Error('UserId missing');

    try {
      const csvData = file.buffer.toString();
      const rawRecords = this.parserFactory.parseCsv(csvData);
      // In production, the service would handle the rest
      return { success: true, message: 'File parsed successfully', count: rawRecords.length };
    } catch (error: any) {
      throw new BadRequestException(`Import failed: ${error.message}`);
    }
  }
}
