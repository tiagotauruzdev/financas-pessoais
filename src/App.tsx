import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import { UserProvider } from './contexts/UserContext'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Settings from './pages/Settings'
import Sidebar from './components/Sidebar'
import Transactions from './pages/Transactions'
import AchievementsPage from './pages/AchievementsPage'
import Budget from './pages/Budget'
import Debts from './pages/Debts'
import FinancialOverview from './components/FinancialOverview'
import EssentialExpenses from './components/EssentialExpenses'
import InvestmentProgress from './components/InvestmentProgress'
import FamilyCard from './components/FamilyCard'
import PetCard from './components/PetCard'
import AnnualAnalysis from './components/AnnualAnalysis'
import DebtScore from './components/DebtScore'
import OpenCards from './components/OpenCards'
import NotificationCard from './components/Notifications/NotificationCard'
import EmergencyFundCard from './components/EmergencyFundCard'
import PaymentDistribution from './components/PaymentDistribution'
import Investments from './pages/Investments'
import { Calculator } from './components/Calculator/Calculator'
import { Login } from './pages/Login';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Toaster } from 'react-hot-toast';
import Family from './pages/Family';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-navy-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}

function App() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)

  return (
    <Router>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div className="flex min-h-screen bg-gray-100 dark:bg-navy-900">
                  <Sidebar />
                  
                  <div className="flex-1 min-w-0 flex flex-col h-screen">
                    <Header onCalculatorClick={() => setIsCalculatorOpen(true)} />
                    
                    <main className="flex-1 container mx-auto px-4 py-8 overflow-y-auto custom-scrollbar">
                      <Routes>
                        <Route path="/configuracoes" element={<Settings />} />
                        <Route path="/lancamentos" element={<Transactions />} />
                        <Route path="/conquistas" element={<AchievementsPage />} />
                        <Route path="/investimentos" element={<Investments />} />
                        <Route path="/orcamento" element={<Budget />} />
                        <Route path="/familia" element={<Family />} />
                        <Route path="/dividas" element={<Debts />} />
                        <Route path="/" element={
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Coluna Principal - Esquerda/Centro */}
                            <div className="lg:col-span-2 space-y-8">
                              {/* Visão Geral Financeira */}
                              <FinancialOverview />
                        
                              {/* Métricas Principais */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <EssentialExpenses />
                                <InvestmentProgress />
                              </div>

                              {/* Cartões de Família */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FamilyCard />
                                <PetCard />
                              </div>
                        
                              {/* Análise Anual */}
                              <AnnualAnalysis />
                            </div>
                      
                            {/* Coluna Lateral - Direita */}
                            <div className="space-y-8">
                              {/* Scores e Métricas */}
                              <DebtScore />
                        
                              {/* Cartões de Gestão */}
                              <div className="grid grid-cols-1 gap-8">
                                <OpenCards />
                                <NotificationCard />
                                <EmergencyFundCard />
                                <PaymentDistribution />
                              </div>
                            </div>
                          </div>
                        } />
                      </Routes>
                    </main>
                  </div>

                  <Calculator 
                    isOpen={isCalculatorOpen} 
                    onClose={() => setIsCalculatorOpen(false)} 
                  />
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App