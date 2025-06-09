export class CreateServiceDto {
  categoryId: number;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number;
  estimatedTime: string;
  serviceLocation: string;
  photoUrls?: string[];
}
