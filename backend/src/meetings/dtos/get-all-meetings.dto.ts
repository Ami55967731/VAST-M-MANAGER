import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class GetAllMeetingsDto {
  @ApiProperty({
    required: false,
    enum: Status,
    description: "Filter meetings by status",
    example: Status.UPCOMING,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({
    required: false,
    default: 1,
    example: 1,
    description: "Page number",
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    example: 10,
    description: "Number of meetings per page",
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  pageSize: number = 10;
}