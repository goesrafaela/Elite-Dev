import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('reservations')
export class ReservationsController {
    constructor(
        private readonly reservationsService: ReservationsService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Body() data: CreateReservationDto,
        @Req()
        request: {
            user: {
                id: string;
                email: string;
                role: string;
            };
        },
    ) {
        return this.reservationsService.create(data, request.user.id);
    }
}