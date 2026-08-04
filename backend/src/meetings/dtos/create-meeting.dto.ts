import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class CreateMeetingDto {
  @ApiProperty({
    example: "Project Kickoff Meeting",
    description: "Meeting title",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
    example: "Discuss project goals and assign tasks.",
    description: "Meeting description",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "Africa/Lagos",
    description: "IANA timezone identifier",
  })
  @IsNotEmpty()
  @IsString()
  timezone: string;

  @ApiProperty({
    example: "2026-08-15T10:00:00.000Z",
    description: "Meeting start time in ISO-8601 format",
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({
    example: 60,
    description: "Meeting duration in minutes",
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    example: "2026-08-15",
    description: "Meeting date in ISO-8601 format",
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    required: false,
    example: "Conference Room A",
    description: "Meeting location",
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    required: false,
    example: false,
    description: "Whether the meeting is recurring",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}