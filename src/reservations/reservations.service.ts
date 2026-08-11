import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateReservationDto, userId: string) {
        const event = await this.prisma.event.findUnique({
            where: {
                id: data.eventId,
            },
        });

        if (!event) {
            throw new NotFoundException('Evento não encontrado');
        }

        if (event.status !== 'PUBLISHED') {
            throw new BadRequestException(
                'Não é possível reservar ingressos para este evento',
            );
        }

        const availableQuantity = event.capacity - event.soldQuantity;

        if (data.quantity > availableQuantity) {
            throw new BadRequestException(
                `Ingressos insuficientes. Disponíveis: ${availableQuantity}`,
            );
        }

        const total = event.price.mul(data.quantity);

        const reservation = await this.prisma.$transaction(async (tx) => {
            const updatedEvent = await tx.event.updateMany({
                where: {
                    id: event.id,
                    status: 'PUBLISHED',
                    soldQuantity: {
                        lte: event.capacity - data.quantity,
                    },
                },
                data: {
                    soldQuantity: {
                        increment: data.quantity,
                    },
                },
            });

            if (updatedEvent.count !== 1) {
                throw new BadRequestException(
                    'Ingressos insuficientes. Tente novamente.',
                );
            }

            return tx.reservation.create({
                data: {
                    userId,
                    eventId: event.id,
                    quantity: data.quantity,
                    total,
                    status: 'PENDING',
                },
            });
        });

        return reservation;
    }
}