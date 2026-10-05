import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'sonner'
import { DiscProvider, useDisc } from './contexts/DiscContext'
import { Shell } from './components/Layout/Shell'
import Splash from './pages/Splash'
import Home from './pages/Home'
import PersonalInformation from './pages/PersonalInformation'
import Questionnaire from './pages/Questionnaire'
import Summary from './pages/Summary'
import Submitting from './pages/Submitting'
import Success from './pages/Success'

function Router() {
  const { step } = useDisc()
  if (step === 'splash') return <Splash />
  if (step === 'submitting') return <Submitting />
  const pages = { home: <Home />, info: <PersonalInformation />, quiz: <Questionnaire />, summary: <Summary />, success: <Success /> } as const
  return <Shell><AnimatePresence mode="wait"><motion.div key={step} className="w-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>{pages[step]}</motion.div></AnimatePresence></Shell>
}
export default function App() {
  return <DiscProvider><Router /><Toaster position="top-center" richColors /></DiscProvider>
}
