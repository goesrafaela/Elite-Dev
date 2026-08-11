import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    findPublished() {
        return this.eventsService.findPublished();
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    create(
        @Body() data: CreateEventDto,
        @Req()
        request: {
            user: {
                id: string;
                email: string;
                role: string;
            };
        },
    ) {
        return this.eventsService.create(data, request.user.id);
    }

    @Patch(':id/publish')
    @UseGuards(JwtAuthGuard, RolesGuard)
    publish(@Param('id') id: string) {
        return this.eventsService.publish(id);
    }
}