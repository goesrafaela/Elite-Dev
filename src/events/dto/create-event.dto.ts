export class CreateEventDto {
    title: string;
    description?: string;
    posterUrl?: string;
    externalId?: string;
    externalSource?: string;

    date: string;
    location: string;
    capacity: number;
    price: number;
}