import { ValidatedInput } from '@/components/ui/ValidatedInput';
import { FileText } from 'lucide-react';
import { CourseFormData } from '@/features/courses/course.types';


interface Props {
  formData: CourseFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CourseBasicInfoForm({ formData, handleChange }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FileText className="h-5 w-5 mr-2" />
        Informações Básicas
      </h3>
      <div className="space-y-6">
        <ValidatedInput label="Nome do Curso" name="nome" required value={formData.nome} onChange={handleChange} />
        <textarea name="descricaoCurta" value={formData.descricaoCurta} onChange={handleChange} placeholder="Descrição resumida do curso..." className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={2} />
        <textarea name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição detalhada do curso..." className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={4} />
      </div>
    </div>
  );
}