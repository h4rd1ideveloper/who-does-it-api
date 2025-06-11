export class CreateServiceDto {
  categoryId: number;
  serviceProviderId: number;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number;
  estimatedTime: string;
  serviceLocation: ServiceLocation;
  photoUrls?: string[];
}
