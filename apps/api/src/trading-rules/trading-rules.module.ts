import { Module } from '@nestjs/common';
import { TradingRulesService } from './trading-rules.service';

@Module({
  providers: [TradingRulesService],
  exports: [TradingRulesService],
})
export class TradingRulesModule {}
