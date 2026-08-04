import { ApiProperty } from "@nestjs/swagger";
import { Status } from "@prisma/client";
import { IsEnum } from "class-validator";

export class SetStatusDto {
  @ApiProperty({
    enum: Status,
    example: Status.TODAY,
    description: "The new status of the meeting",
  })
  @IsEnum(Status, {
   
  })
  status: Status;
}