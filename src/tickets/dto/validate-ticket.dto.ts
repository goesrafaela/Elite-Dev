import { IsString, IsUUID } from 'class-validator';

export class ValidateTicketDto {
    @IsUUID()
    ticketId: string;
}