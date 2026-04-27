import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsBoolean,
} from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @MaxLength(320)
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(1)
  @MaxLength(256)
  name!: string;

  @IsOptional()
  @IsString()
  traderType?: string;

  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;
}
