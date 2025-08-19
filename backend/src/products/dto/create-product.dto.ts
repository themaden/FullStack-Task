import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsNumber() @Min(0)
  price: number;

  @IsOptional() @IsString()
  description?: string;
}
