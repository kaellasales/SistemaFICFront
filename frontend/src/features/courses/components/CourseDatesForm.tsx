import { ValidatedInput } from '@/components/ui/ValidatedInput';
import { Calendar } from 'lucide-react';
import { CourseFormData } from '@/features/courses/course.types';


interface Props {
  formData: CourseFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CourseDatesForm({ formData, handleChange }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2" />
        Datas Importantes
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ValidatedInput label="Início das Inscrições" name="dataInicioInscricoes" required type="date" value={formData.dataInicioInscricoes} onChange={handleChange} />
        <ValidatedInput label="Fim das Inscrições" name="dataFimInscricoes" required type="date" value={formData.dataFimInscricoes} onChange={handleChange} />
        <ValidatedInput label="Início do Curso" name="dataInicioCurso" required type="date" value={formData.dataInicioCurso} onChange={handleChange} />
        <ValidatedInput label="Fim do Curso" name="dataFimCurso" required type="date" value={formData.dataFimCurso} onChange={handleChange} />
      </div>
    </div>
  );
}