import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
    constructor(private readonly prisma: PrismaService) { }

    async validate(ticketId: string, validatorId: string) {
        const ticket = await this.prisma.ticket.findUnique({
            where: {
                id: ticketId,
            },
        });

        if (!ticket) {
            throw new NotFoundException('Ingresso não encontrado');
        }

        if (ticket.status !== 'ACTIVE') {
            throw new BadRequestException('Ingresso já utilizado ou cancelado');
        }

        return this.prisma.ticket.update({
            where: {
                id: ticketId,
            },
            data: {
                status: 'USED',
                validatedAt: new Date(),
                validatedBy: validatorId,
            },
        });
    }
}