export class CreateServiceDto {
  categoria_id: number;
  titulo: string;
  descricao: string;
  preco_min: number;
  preco_max: number;
  tempo_estimado: string;
  local_atendimento: string;
  fotos_urls?: string[];
}
