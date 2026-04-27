import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  IsArray,
  IsDateString,
  IsBoolean,
} from "class-validator";
import { Exchange, InstrumentType, TradeDirection } from "@thirdleaf/types";

export class CreateTradeDto {
  @IsString()
  symbol!: string;

  @IsEnum(Exchange)
  exchange!: Exchange;

  @IsEnum(InstrumentType)
  instrumentType!: InstrumentType;

  @IsEnum(TradeDirection)
  direction!: TradeDirection;

  @IsString()
  entryPrice!: string; // Passed as string for precision front-end input e.g. "125.50"

  @IsOptional()
  @IsString()
  exitPrice?: string;

  @IsNumber()
  quantity!: number;

  @IsDateString()
  entryTime!: string;

  @IsOptional()
  @IsDateString()
  exitTime?: string;

  @IsOptional()
  @IsString()
  brokerage?: string;

  @IsOptional()
  @IsString()
  taxes?: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  setupTagIds?: string[];

  @IsOptional()
  @IsUUID("4")
  emotionAtEntry?: string;

  @IsOptional()
  @IsUUID("4")
  emotionAtExit?: string;

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  mistakeTagIds?: string[];

  @IsOptional()
  @IsUUID("4")
  strategyId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString() // stop loss base point price
  stopLoss?: string;

  @IsOptional()
  @IsString() // Target base point price
  takeProfit?: string;
}
