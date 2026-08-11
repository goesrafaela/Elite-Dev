import { Module } from '@nestjs/common';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';



@Module({
  imports: [PrismaModule, EventsModule, AuthModule, ReservationsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }