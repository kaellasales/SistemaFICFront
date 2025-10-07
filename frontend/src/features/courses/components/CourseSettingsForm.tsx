import { ValidatedInput } from '@/components/ui/ValidatedInput';
import { Clock } from 'lucide-react';
import { CourseFormData } from '@/features/courses/course.types';

interface Props {
  formData: CourseFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CourseSettingsForm({ formData, handleChange }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        Configurações
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ValidatedInput label="Vagas Internas" name="vagasInternas" required type="number" min="0" value={formData.vagasInternas} onChange={handleChange} />
        <ValidatedInput label="Vagas Externas" name="vagasExternas" required type="number" min="0" value={formData.vagasExternas} onChange={handleChange} />
        <ValidatedInput label="Carga Horária (horas)" name="cargaHoraria" required type="number" min="0" value={formData.cargaHoraria} onChange={handleChange} />
      </div>
    </div>
  );
}