import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class UpdateMeetingDto {
  @ApiProperty({
    required: false,
    example: "Project Kickoff Meeting",
    description: "Meeting title",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    example: "Discuss project goals and assign tasks.",
    description: "Meeting description",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    example: "Africa/Lagos",
    description: "IANA timezone identifier",
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({
    required: false,
    example: "2026-08-15T10:00:00.000Z",
    description: "Meeting start time in ISO-8601 format",
  })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({
    required: false,
    example: 60,
    description: "Meeting duration in minutes",
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiProperty({
    required: false,
    example: "2026-08-15",
    description: "Meeting date in ISO-8601 format",
  })
  @IsOptional()
  @IsDateString()
  date?: string;

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
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}