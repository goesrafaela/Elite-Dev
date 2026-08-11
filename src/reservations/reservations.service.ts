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

        const quantity = data.seats.length;

        if (quantity < 1) {
            throw new BadRequestException(
                'Selecione pelo menos um assento',
            );
        }

        const availableQuantity =
            event.capacity - event.soldQuantity;

        if (quantity > availableQuantity) {
            throw new BadRequestException(
                `Ingressos insuficientes. Disponíveis: ${availableQuantity}`,
            );
        }

        const total = event.price.mul(quantity);

        const reservation = await this.prisma.$transaction(
            async (tx) => {
                const occupiedSeats = await tx.seat.findMany({
                    where: {
                        eventId: event.id,
                        code: {
                            in: data.seats,
                        },
                        reservationId: {
                            not: null,
                        },
                    },
                });

                if (occupiedSeats.length > 0) {
                    throw new BadRequestException(
                        `Assento(s) já ocupado(s): ${occupiedSeats
                            .map((seat) => seat.code)
                            .join(', ')}`,
                    );
                }

                const updatedEvent = await tx.event.updateMany({
                    where: {
                        id: event.id,
                        status: 'PUBLISHED',
                        soldQuantity: {
                            lte: event.capacity - quantity,
                        },
                    },
                    data: {
                        soldQuantity: {
                            increment: quantity,
                        },
                    },
                });

                if (updatedEvent.count !== 1) {
                    throw new BadRequestException(
                        'Ingressos insuficientes. Tente novamente.',
                    );
                }

                const createdReservation =
                    await tx.reservation.create({
                        data: {
                            userId,
                            eventId: event.id,
                            quantity,
                            total,
                            status: 'PENDING',
                        },
                    });

                await tx.seat.updateMany({
                    where: {
                        eventId: event.id,
                        code: {
                            in: data.seats,
                        },
                        reservationId: null,
                    },
                    data: {
                        reservationId: createdReservation.id,
                    },
                });

                return createdReservation;
            },
        );

        return reservation;
    }
}