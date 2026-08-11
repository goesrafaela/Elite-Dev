export class RegisterDto {
    name: string;
    email: string;
    password: string;
    role?: 'CUSTOMER' | 'ORGANIZER' | 'GATE';
}