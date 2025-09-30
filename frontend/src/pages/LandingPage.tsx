import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'

export function LandingPage() {
  const navigate = useNavigate()

  const handleCursosClick = () => {
    navigate('/login')
  }

  const handleRoleClick = (role: string) => {
    navigate('/login', { state: { role } })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Seção verde escura */}
      <header className="bg-green-800 rounded-b-2xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo e texto do Instituto */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
              <Logo size="sm" />
            </div>
            <div className="text-white">
              <div className="text-sm font-medium">Instituto Federal de Educação</div>
              <div className="text-sm">Campus Ceará</div>
            </div>
          </div>

          {/* Botões de navegação */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleRoleClick('candidate')}
              className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Sou Aluno
            </button>
            <button 
              onClick={() => handleRoleClick('professor')}
              className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Sou Professor
            </button>
            <button 
              onClick={() => handleRoleClick('admin')}
              className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              CCA
            </button>
            <button 
              onClick={() => navigate('/results')}
              className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Resultados
            </button>
          </div>
        </div>
      </header>

      {/* Seção principal - Conteúdo central */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          {/* Logo MatriFIC */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Logo size="lg" />
            <div className="text-left">
              <div className="text-4xl font-bold">
                <span className="text-green-800">Matri</span>
                <span className="text-green-600">FIC</span>
              </div>
              <div className="text-lg text-green-600 font-medium">Cursos Fic</div>
            </div>
          </div>

          {/* Botão Cursos */}
          <button 
            onClick={handleCursosClick}
            className="bg-green-800 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-lg hover:bg-green-700 transition-colors"
          >
            Cursos
          </button>
        </div>
      </main>

      {/* Footer - Seção verde clara */}
      <footer className="bg-green-100 rounded-t-2xl px-6 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white text-xl font-medium mb-4">O que é?</div>
          <div className="w-32 h-0.5 bg-white mx-auto"></div>
        </div>
      </footer>
    </div>
  )
}
