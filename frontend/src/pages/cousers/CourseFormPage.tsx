import { useParams, useNavigate } from 'react-router-dom';
import { useCourseForm } from '@/features/courses/hooks/useCourseForm';
import { Button } from '@/components/ui/Button';
import { Save, ArrowLeft } from 'lucide-react';


import { CourseBasicInfoForm } from '@/features/courses/components/CourseBasicInfoForm';
import { CourseSettingsForm } from '@/features/courses/components/CourseSettingsForm';
import { CourseDatesForm } from '@/features/courses/components/CourseDatesForm';
import { CourseRequirementsForm } from '@/features/courses/components/CourseRequirementsForm';

export function CourseFormPage() {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  
  // O hook nos dá tudo que precisamos: dados e funções
  const { 
    formData, 
    loading, 
    saving, 
    isEditing, 
    handleChange, 
    handleSubmit 
  } = useCourseForm(id);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando formulário...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white px-6 py-6 rounded-b-3xl">
         {/* Seu header aqui */}
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/my-courses')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{isEditing ? 'Editar Curso' : 'Novo Curso'}</h2>
            <p className="text-gray-600 mt-1">{isEditing ? 'Atualize as informações do curso' : 'Preencha as informações para agendar um novo curso'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* O componente principal agora apenas monta as peças */}
          <CourseBasicInfoForm formData={formData} handleChange={handleChange} />
          <CourseSettingsForm formData={formData} handleChange={handleChange} />
          <CourseDatesForm formData={formData} handleChange={handleChange} />
          <CourseRequirementsForm formData={formData} handleChange={handleChange} />

          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => navigate('/my-courses')} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover-bg-green-700" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : (isEditing ? 'Atualizar Curso' : 'Salvar e Agendar')}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}