import { useState, useEffect } from 'react';
import { useCourseStore } from '@/features/courses/stores/useCourseStore';
import { Course } from '@/features/courses/types/course.types';
import toast from 'react-hot-toast';
// --- A CORREÇÃO ESTÁ AQUI: Apontando para o caminho 'shared' ---
import { Button } from '@/components/ui/Button'; 

export function useMyCourses() {
  const { courses, fetchCourses, deleteCourse } = useCourseStore();
  
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses()
      .catch(() => toast.error("Não foi possível carregar seus cursos."))
      .finally(() => setLoading(false));
  }, [fetchCourses]);

  // A função de exclusão elegante, que já estava correta
  const handleDelete = (id: number) => {
    toast((t) => (
      <div className="flex flex-col items-center gap-2 p-2">
        <p className="font-semibold text-center">Tem certeza que deseja excluir este curso?</p>
        <p className="text-sm text-gray-600">Esta ação não pode ser desfeita.</p>
        <div className="flex gap-2 mt-3 w-full">
          <Button variant="destructive" size="sm" className="flex-1" onClick={() => {
            // Usa toast.promise para dar o feedback de "excluindo..."
            toast.promise(deleteCourse(id), {
              loading: 'Excluindo curso...',
              success: 'Curso excluído com sucesso!',
              error: 'Falha ao excluir o curso.',
            }).then(() => {
              setSelectedCourse(null); // Fecha o modal de detalhes
            });
            toast.dismiss(t.id); // Fecha este toast de confirmação
          }}>
            Sim, excluir
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.dismiss(t.id)}>
            Cancelar
          </Button>
        </div>
      </div>
    ), {
      duration: 6000, // Dá mais tempo para o professor decidir
    });
  };

  return {
    courses,
    loading,
    selectedCourse,
    setSelectedCourse,
    handleDelete,
  };
}