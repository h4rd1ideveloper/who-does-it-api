import { CreateServiceDto } from './create-service.dto';

export class CreatePrestadorDto {
  token: string;
  nome: string;
  email: string;
  senha: string;
  cpf_cnpj: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  atende_domicilio: boolean;
  horario_funcionamento: string;
  foto_url?: string;
  servicos?: CreateServiceDto[];
}
