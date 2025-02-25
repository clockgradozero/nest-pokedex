import { IsNumber, IsOptional, IsPositive, isPositive, Min } from "class-validator";

export class PaginationDto {
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?: number;
} 