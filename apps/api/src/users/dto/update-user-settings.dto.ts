import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  IsObject,
  Min,
  Max,
  MaxLength,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

const VALID_BROKERS = [
  "zerodha",
  "upstox",
  "angel_one",
  "fyers",
  "dhan",
  "other",
] as const;

const VALID_CURRENCIES = ["INR", "USD", "EUR"] as const;

export class NotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  tradeSync?: boolean;

  @IsOptional()
  @IsBoolean()
  dailyJournalReminder?: boolean;

  @IsOptional()
  @IsBoolean()
  weeklyReview?: boolean;

  @IsOptional()
  @IsBoolean()
  drawdownAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  brokerTokenExpiry?: boolean;
}

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsString()
  @IsIn(VALID_BROKERS, { message: "Invalid broker" })
  defaultBroker?: string;

  @IsOptional()
  @IsString()
  @IsIn(VALID_CURRENCIES, { message: "Invalid currency" })
  defaultCurrency?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1, { message: "Risk per trade must be at least 0.1%" })
  @Max(10, { message: "Risk per trade cannot exceed 10%" })
  riskPerTrade?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  dailyLossLimit?: number;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  customBrokeragePaise?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  brokerageCapPaise?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  notifications?: NotificationPreferencesDto;
}
