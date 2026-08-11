import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Body() data: CreatePaymentDto,
        @Req()
        request: {
            user: {
                id: string;
                email: string;
                role: string;
            };
        },
    ) {
        return this.paymentsService.create(data, request.user.id);
    }
}