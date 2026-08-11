import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreatePaymentDto, userId: string) {
        console.log('=== PAGAMENTO ===');
        console.log('reservationId:', data.reservationId);
        console.log('userId:', userId);
        console.log('simulate:', data.simulate);

        const reservation = await this.prisma.reservation.findFirst({
            where: {
                id: data.reservationId,
                userId,
            },
        });

        console.log('RESERVA ENCONTRADA:', reservation);

        if (!reservation) {
            throw new NotFoundException('Reserva não encontrada');
        }

        console.log('STATUS DA RESERVA:', reservation.status);

        if (reservation.status !== 'PENDING') {
            throw new BadRequestException(
                `A reserva não está disponível para pagamento. Status atual: ${reservation.status}`,
            );
        }

        const existingPayment = await this.prisma.payment.findUnique({
            where: {
                reservationId: reservation.id,
            },
        });

        console.log('PAGAMENTO EXISTENTE:', existingPayment);

        if (existingPayment) {
            throw new BadRequestException('Pagamento já iniciado');
        }

        if (data.simulate === 'DECLINED') {
            const payment = await this.prisma.payment.create({
                data: {
                    reservationId: reservation.id,
                    amount: reservation.total,
                    status: 'DECLINED',
                    transactionId: `SIM-DECLINED-${Date.now()}`,
                },
            });

            return {
                payment,
                reservation: {
                    id: reservation.id,
                    status: reservation.status,
                },
                tickets: [],
            };
        }

        return this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    reservationId: reservation.id,
                    amount: reservation.total,
                    status: 'APPROVED',
                    transactionId: `SIM-APPROVED-${Date.now()}`,
                },
            });

            await tx.reservation.update({
                where: {
                    id: reservation.id,
                },
                data: {
                    status: 'PAID',
                },
            });

            const tickets = [];

            for (let i = 0; i < reservation.quantity; i++) {
                const ticket = await tx.ticket.create({
                    data: {
                        reservationId: reservation.id,
                        eventId: reservation.eventId,
                        userId: reservation.userId,
                        codeHash: `TICKET-${reservation.id}-${i + 1}-${Date.now()}`,
                    },
                });

                tickets.push(ticket);
            }

            return {
                payment,
                reservation: {
                    id: reservation.id,
                    status: 'PAID',
                },
                tickets,
            };
        });
    }

}