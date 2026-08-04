import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class ChangeNameDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}