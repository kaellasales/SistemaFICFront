export interface AlunoFormData {
  dataNascimento: string;
  sexo: string;
  cpf: string;
  numeroIdentidade: string;
  orgaoExpedidor: string;
  ufExpedidor: number | string; // Usaremos o ID do estado
  naturalidade: number | string; // Usaremos o ID do município
  cep: string;
  logradouro: string;
  numeroEndereco: string;
  bairro: string;
  cidade: number | string; // Usaremos o ID do município
  telefoneCelular: string;
  naturalidadeUf: number | string; 
  enderecoUf: number | string; 
}

// Valores iniciais para o formulário
export const initialAlunoFormData: AlunoFormData = {
  dataNascimento: '',
  sexo: '',
  cpf: '',
  numeroIdentidade: '',
  orgaoExpedidor: '',
  ufExpedidor: '',
  naturalidade: '',
  cep: '',
  logradouro: '',
  numeroEndereco: '',
  bairro: '',
  cidade: '',
  telefoneCelular: '',
};