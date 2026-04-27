import { Injectable } from '@nestjs/common';
import { ZerodhaParser } from './zerodha.parser';
import { parse } from 'csv-parse/sync';

@Injectable()
export class BrokerParserFactory {
  getParser(broker: string) {
    if (broker.toUpperCase() === 'ZERODHA') {
      return new ZerodhaParser();
    }
    throw new Error(`Unsupported broker: ${broker}`);
  }

  /**
   * Safe CSV parse helper
   */
  parseCsv(content: string) {
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: true,
    });
  }
}
