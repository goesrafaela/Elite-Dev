import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateEventDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    posterUrl?: string;

    @IsOptional()
    @IsString()
    externalId?: string;

    @IsOptional()
    @IsString()
    externalSource?: string;

    @IsDateString()
    date: string;

    @IsString()
    location: string;

    @IsNumber()
    @Min(1)
    capacity: number;

    @IsNumber()
    @Min(0)
    price: number;
}