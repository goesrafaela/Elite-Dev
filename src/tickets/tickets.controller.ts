import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { TicketsService } from './tickets.service';
import { ValidateTicketDto } from './dto/validate-ticket.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post('validate')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('GATE')
    validate(
        @Body() data: ValidateTicketDto,
        @Req()
        request: {
            user: {
                id: string;
                email: string;
                role: string;
            };
        },
    ) {
        return this.ticketsService.validate(
            data.ticketId,
            request.user.id,
        );
    }
}