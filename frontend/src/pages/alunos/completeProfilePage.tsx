import { useAlunoProfileForm } from '@/features/alunos/hooks/useAlunoProfileForm';
import { Button } from '@/components/ui/Button';
import { ValidatedInput } from '@/components/ui/ValidatedInput';
import { ValidatedSelect } from '@/components/ui/ValidatedSelect';
import { Combobox } from '@/components/ui/Combobox'; 
import { Save } from 'lucide-react';

export function CompleteProfilePage() {
  const { 
    formData, loading, saving, handleChange, handleSubmit,
    formOptions, estados, naturalidadeMunicipios, enderecoMunicipios,
    naturalidadeSearch, setNaturalidadeSearch, enderecoSearch, setEnderecoSearch
  } = useAlunoProfileForm();

  if (loading || !formOptions) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete seu Perfil</h1>
      <p className="text-gray-600 mb-8">Confirme ou preencha suas informações para continuar.</p>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* --- Seção de Dados Pessoais --- */}
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-green-800 border-b pb-2">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ValidatedInput label="Data de Nascimento" name="dataNascimento" type="date" value={formData.dataNascimento || ''} onChange={handleChange} />
                <ValidatedInput label="CPF" name="cpf" value={formData.cpf || ''} onChange={handleChange} />
                <ValidatedSelect label="Sexo" name="sexo" value={formData.sexo || ''} onChange={handleChange} options={formOptions.sexo} placeholder="Selecione..."/>
            </div>
        </div>

        {/* --- Seção de Documento de Identidade --- */}
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-green-800 border-b pb-2">Documento de Identidade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ValidatedInput label="Número do RG" name="numeroIdentidade" value={formData.numeroIdentidade || ''} onChange={handleChange} />
                <ValidatedSelect label="Órgão Expedidor" name="orgaoExpedidor" value={formData.orgaoExpedidor || ''} onChange={handleChange} options={formOptions.orgao_expedidor} placeholder="Selecione"/>
                <ValidatedSelect label="UF de Expedição" name="ufExpedidor" value={formData.ufExpedidor || ''} onChange={handleChange} options={estados.map(e => ({ value: e.id, label: e.uf }))} placeholder="Selecione"/>
            </div>
        </div>

        {/* --- Seção de Origem e Endereço (FINAL) --- */}
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-green-800 border-b pb-2">Origem e Endereço</h2>
            
            <div className="p-4 border rounded-md space-y-4">
                <label className="text-md font-medium text-gray-700">Naturalidade</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ValidatedSelect label="UF de Nascimento" name="naturalidadeUf" value={formData.naturalidadeUf || ''} onChange={handleChange} options={estados.map(e => ({ value: e.id, label: e.uf }))} placeholder="Selecione" />
                    <Combobox label="Cidade de Nascimento" name="naturalidade" value={formData.naturalidade} onSelect={(value) => handleChange({ target: { name: 'naturalidade', value } } as any)} searchValue={naturalidadeSearch} onSearchChange={setNaturalidadeSearch} options={naturalidadeMunicipios.map(m => ({ value: m.id, label: m.nome }))} placeholder="Digite para buscar..." disabled={!formData.naturalidadeUf} />
                </div>
            </div>

            <div className="p-4 border rounded-md space-y-4">
                <label className="text-md font-medium text-gray-700">Endereço Atual</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ValidatedInput label="CEP" name="cep" value={formData.cep || ''} onChange={handleChange} />
                    <ValidatedInput label="Logradouro" name="logradouro" value={formData.logradouro || ''} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ValidatedInput label="Número" name="numeroEndereco" value={formData.numeroEndereco || ''} onChange={handleChange} />
                    <ValidatedInput label="Bairro" name="bairro" value={formData.bairro || ''} onChange={handleChange} />
                    <ValidatedInput label="Celular" name="telefoneCelular" value={formData.telefoneCelular || ''} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ValidatedSelect label="Estado do Endereço" name="enderecoUf" value={formData.enderecoUf || ''} onChange={handleChange} options={estados.map(e => ({ value: e.id, label: e.uf }))} placeholder="Selecione" />
                    <Combobox label="Cidade do Endereço" name="cidade" value={formData.cidade} onSelect={(value) => handleChange({ target: { name: 'cidade', value } } as any)} searchValue={enderecoSearch} onSearchChange={setEnderecoSearch} options={enderecoMunicipios.map(m => ({ value: m.id, label: m.nome }))} placeholder="Digite para buscar..." disabled={!formData.enderecoUf} />
                </div>
            </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-end pt-8">
            <Button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar e Continuar'}
            </Button>
        </div>
      </form>
    </div>
  );
}