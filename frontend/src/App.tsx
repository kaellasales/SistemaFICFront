import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { Layout } from '@/components/layout/Layout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ProfessorRegisterPage } from '@/pages/auth/ProfessorRegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CoursesPage } from '@/pages/courses/CoursesPage'
import { EnrollmentsPage } from '@/pages/my-enrollments/EnrollmentsPage'
import { CertificatesPage } from '@/pages/certificates/CertificatesPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { EnrollmentPage } from '@/pages/course-enrollment/EnrollmentPage'
import { ProfessorDashboardPage } from '@/pages/ProfessorDashboardPage'
import { MyCoursesPage } from '@/pages/MyCoursesPage'
import { CourseFormPage } from '@/pages/CourseFormPage'
import { CourseEnrollmentsPage } from '@/pages/CourseEnrollmentsPage'
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
      <Route path="/register/professor" element={<ProfessorRegisterPage />} />
      
            {/* Rota de matrícula (protegida) */}
            <Route path="/enrollment" element={
              <ProtectedRoute>
                <EnrollmentPage />
              </ProtectedRoute>
            } />
            
            {/* Rota específica para dashboard do professor */}
            <Route path="/professor-dashboard" element={
              <ProtectedRoute>
                <ProfessorDashboardPage />
              </ProtectedRoute>
            } />
            
            
            {/* Rotas para gerenciamento de cursos */}
            <Route path="/courses/create" element={
              <ProtectedRoute>
                <CourseFormPage />
              </ProtectedRoute>
            } />
            <Route path="/courses/:id/edit" element={
              <ProtectedRoute>
                <CourseFormPage />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/enrollments" element={
              <ProtectedRoute>
                <CourseEnrollmentsPage />
              </ProtectedRoute>
            } />
      
      {/* Rotas protegidas */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Rotas específicas por perfil */}
                {user?.role === 'candidate' && (
                  <>
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/enrollments" element={<EnrollmentsPage />} />
                    <Route path="/certificates" element={<CertificatesPage />} />
                  </>
                )}
                
                {user?.role === 'professor' && (
                  <>
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/enrollments" element={<EnrollmentsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/my-courses" element={<MyCoursesPage />} />
                  </>
                )}
                
                {user?.role === 'admin' && (
                  <>
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/enrollments" element={<EnrollmentsPage />} />
                    <Route path="/certificates" element={<CertificatesPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                  </>
                )}
                
                <Route path="*" element={
                  <Navigate to={
                    user?.role === 'professor' ? '/professor-dashboard' : '/dashboard'
                  } replace />
                } />
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
