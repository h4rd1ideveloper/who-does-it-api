import { CreateServiceDto } from './create-service.dto';

export class CreateServiceProviderDto {
  token: string;
  name: string;
  email: string;
  password: string;
  cpfCnpj: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  homeService: boolean;
  businessHours: string;
  photoUrl?: string;
  services?: CreateServiceDto[];
}
