import { Module } from '@nestjs/common';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { PaymentsModule } from './payments/payments.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    AuthModule,
    ReservationsModule,
    PaymentsModule,
    TicketsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }