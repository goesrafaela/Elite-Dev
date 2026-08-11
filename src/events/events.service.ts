import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    constructor(private readonly prisma: PrismaService) { }

    async findPublished() {
        return this.prisma.event.findMany({
            where: {
                status: 'PUBLISHED',
            },
        });
    }

    async create(data: CreateEventDto, organizerId: string) {
        return this.prisma.event.create({
            data: {
                ...data,
                organizerId,
                status: 'DRAFT',
            },
        });
    }

    async publish(id: string) {
        return this.prisma.event.update({
            where: {
                id,
            },
            data: {
                status: 'PUBLISHED',
            },
        });
    }
}