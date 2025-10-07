import { CourseFormData } from '@/features/courses/course.types';

interface Props {
  formData: CourseFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CourseRequirementsForm({ formData, handleChange }: Props) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisitos</h3>
            <textarea name="requisitos" value={formData.requisitos} onChange={handleChange} placeholder="Liste os pré-requisitos para o curso" className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} />
        </div>
    )
}