import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { Layout } from '@/components/layout/Layout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ProfessorRegisterPage } from '@/pages/auth/ProfessorRegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { EnrollmentsPage } from '@/pages/my-enrollments/EnrollmentsPage'
import { CertificatesPage } from '@/pages/certificates/CertificatesPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { ProfessoresPage } from '@/pages/professor/ProfessoresPage'
import { ProfessorDetailPage } from '@/pages/professor/ProfessorDetailPage'
import { EnrollmentPage } from '@/pages/course-enrollment/EnrollmentPage'
import { MyCoursesPage } from '@/pages/cousers/MyCoursesPage'
import { CourseFormPage } from '@/pages/cousers/CourseFormPage'
import { CourseEnrollmentsPage } from '@/pages/cousers/CourseEnrollmentsPage'
import { Toaster } from 'react-hot-toast'

function App() {
  const { user } = useAuthStore()

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Rota da landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rotas protegidas que não usam o Layout principal */}
        
        {/* CORREÇÃO DE SINTAXE: O fechamento da rota '/>' e da chave '}' foi ajustado. */}
        <Route 
          path="/register/professor" 
          element={
            <ProtectedRoute>
                <ProfessorRegisterPage />
            </ProtectedRoute>
          } 
        />

        {/* CORREÇÃO DE SINTAXE: Aplicada a mesma correção aqui. */}
        <Route 
          path="/enrollment" 
          element={
            <ProtectedRoute>
                <EnrollmentPage />
            </ProtectedRoute>
          } 
        />

        {/* CORREÇÃO DE SINTAXE: Aplicada a mesma correção aqui. */}
        <Route 
          path="/courses/create" 
          element={
            <ProtectedRoute>
                <CourseFormPage />
            </ProtectedRoute>
          } 
        />

        {/* CORREÇÃO DE SINTAXE: Aplicada a mesma correção aqui. */}
        <Route 
          path="/courses/:id/edit" 
          element={
            <ProtectedRoute>
                <CourseFormPage />
            </ProtectedRoute>
          } 
        />

        {/* CORREÇÃO DE SINTAXE: Aplicada a mesma correção aqui. */}
        <Route 
          path="/courses/:courseId/enrollments" 
          element={
            <ProtectedRoute>
                <CourseEnrollmentsPage />
            </ProtectedRoute>
          } 
        />
      
        {/* Rotas protegidas que usam o Layout principal */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  {/* Rota de Dashboard Unificada para TODOS */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  
                  {user?.groups.includes('ALUNO') && (
                    <>
                      <Route path="/courses" element={<CoursesPage />} />
                      <Route path="/enrollments" element={<EnrollmentsPage />} />
                      <Route path="/certificates" element={<CertificatesPage />} />
                    </>
                  )}
                  
                  {user?.groups.includes('PROFESSOR') && (
                    <>
                      <Route path="/my-courses" element={<MyCoursesPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                    </>
                  )}
                  
                  {user?.groups.includes('CCA') && (
                    <>
                      <Route path="/courses" element={<CoursesPage />} />
                      <Route path="/enrollments" element={<EnrollmentsPage />} />
                      <Route path="/certificates" element={<CertificatesPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/professores" element={<ProfessoresPage />}/>
                      <Route path="/professores/cadastrar" element={<ProfessorRegisterPage />}/>
                      <Route path="/professores/:id" element={<ProfessorDetailPage />} />
                    </>
                  )}
                  
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App