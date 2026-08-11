import {
    ArrayNotEmpty,
    IsArray,
    IsString,
    IsUUID,
} from 'class-validator';

export class CreateReservationDto {
    @IsUUID()
    eventId: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    seats: string[];
}