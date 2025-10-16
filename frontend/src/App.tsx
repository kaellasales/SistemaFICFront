import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- Lógica de Roteamento e Guarda ---
import { useAuthStore } from '@/shared/stores/authStore';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { ProfileCompletionGuard } from '@/shared/components/ProfileCompletionGuard';

// --- Layouts e Páginas ---
import { Layout } from '@/components/layout/Layout';
import { DashboardPage } from '@/pages/DashboardPage';

// Páginas de Autenticação
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProfessorFormPage } from '@/pages/auth/ProfessorRegisterPage';

// Página de Perfil do Aluno (corrigindo para pasta 'aluno' singular)
import { CompleteProfilePage } from '@/pages/alunos/completeProfilePage';

// <<< CORREÇÃO: Caminho da pasta 'courses' (com 'o') ajustado >>>
import { CoursesPage } from '@/pages/courses/CoursesPage';
import { MyCoursesPage } from '@/pages/courses/MyCoursesPage';
import { CourseFormPage } from '@/pages/courses/CourseFormPage';
import { CourseEnrollmentsPage } from '@/pages/courses/CourseEnrollmentsPage';

// Outras Páginas
import { EnrollmentsPage } from '@/pages/my-enrollments/EnrollmentsPage';
import { CertificatesPage } from '@/pages/certificates/CertificatesPage';
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { ProfessoresPage } from '@/pages/professor/ProfessoresPage';
import { ProfessorDetailPage } from '@/pages/professor/ProfessorDetailPage';
import { EnrollmentPage } from '@/pages/course-enrollment/EnrollmentPage';
import { AdminCoursesPage } from '@/pages/admin/AdminCoursesPage';

function App() {
  const { user } = useAuthStore();
  const userGroups = user?.groups || [];

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* --- Rotas Públicas --- */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* --- Rotas Protegidas Especiais (Fora do Layout Principal) --- */}
        <Route path="/aluno/complete-profile" element={<ProtectedRoute><CompleteProfilePage /></ProtectedRoute>} />
        <Route path="/courses/create" element={<ProtectedRoute><CourseFormPage /></ProtectedRoute>} />
        <Route path="/courses/:id/edit" element={<ProtectedRoute><CourseFormPage /></ProtectedRoute>} />
        <Route path="/enrollment" element={<ProtectedRoute><EnrollmentPage /></ProtectedRoute>} />
        
        {/* --- Área Principal da Aplicação (Com Layout e Guarda de Perfil) --- */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ProfileCompletionGuard>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    
                    {/* <<< REATORAÇÃO: Blocos de rota EXCLUSIVOS por perfil >>> */}

                    {/* Rotas visíveis APENAS para ALUNO */}
                    {userGroups.includes('ALUNO') && (
                      <>
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/enrollments" element={<EnrollmentsPage />} />
                        <Route path="/certificates" element={<CertificatesPage />} />
                      </>
                    )}
                    
                    {/* Rotas visíveis APENAS para PROFESSOR */}
                    {userGroups.includes('PROFESSOR') && (
                      <>
                        <Route path="/my-courses" element={<MyCoursesPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                      </>
                    )}
                    
                    {/* Rotas visíveis APENAS para CCA */}
                    {userGroups.includes('CCA') && (
                      <>
                        <Route path="/admin/courses" element={<AdminCoursesPage />} />
                        <Route path="/professores" element={<ProfessoresPage />}/>
                        <Route path="/professores/:id/edit" element={<ProfessorFormPage />} /> 
                        <Route path="/professores/cadastrar" element={<ProfessorFormPage />}/>
                        <Route path="/professores/:id" element={<ProfessorDetailPage />} />
                        <Route path="/courses/:courseId/enrollments" element={<CourseEnrollmentsPage />} />
                      </>
                    )}
                    
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              </ProfileCompletionGuard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App;