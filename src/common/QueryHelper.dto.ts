import { Transform, Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsObject } from 'class-validator';

export class QueryHelperDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsObject()
  filter?: Record<string, string>;

  @IsOptional()
  @Transform(({ value }) => {
    // convierte: { 'name': 'ASC', 'createdAt': 'DESC' }
    // a: [['name', 'ASC'], ['createdAt', 'DESC']]
    if (!value || typeof value !== 'object') return [];
    return Object.entries(value);
  })
  sort?: [string, 'ASC' | 'DESC'][];
}
