
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  groups: string[];
}

export interface Aluno {
  id: number;
  user: User; // O objeto de usuário aninhado
  dataNascimento: string | null;
  sexo: string;
  cpf: string | null;
  numeroIdentidade: string;
  orgaoExpedidor: string;
  ufExpedidor: number | string | null;
  naturalidade: number | string | null;
  cep: string;
  logradouro: string;
  numeroEndereco: string;
  bairro: string;
  cidade: number | string | null;
  telefoneCelular: string;
}

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