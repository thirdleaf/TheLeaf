import { IsOptional, IsString, IsEnum, IsBooleanString, IsNumberString, IsArray } from "class-validator";
import { Exchange, TradeDirection } from "@thirdleaf/types";

export class TradesQueryDto {
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  symbol?: string;

  @IsOptional()
  @IsEnum(Exchange)
  exchange?: Exchange;

  @IsOptional()
  @IsEnum(TradeDirection)
  direction?: TradeDirection;

  @IsOptional()
  @IsString()
  strategyId?: string;

  @IsOptional()
  @IsBooleanString()
  isOpen?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  setupTagIds?: string[];

  @IsOptional()
  @IsString()
  emotionAtEntry?: string;

  @IsOptional()
  @IsNumberString()
  minPnl?: string;

  @IsOptional()
  @IsNumberString()
  maxPnl?: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  sortBy?: "date" | "pnl" | "holdDuration" | "rMultipleActual";

  @IsOptional()
  @IsString()
  sortOrder?: "asc" | "desc";
}
