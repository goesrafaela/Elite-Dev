import { IsIn, IsString } from 'class-validator';

export class CreatePaymentDto {
    @IsString()
    reservationId: string;

    @IsIn(['APPROVED', 'DECLINED'])
    simulate: 'APPROVED' | 'DECLINED';
}