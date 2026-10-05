import { Pencil, RotateCcw, Send } from '../components/Icons'
import { Card } from '../components/UI/Card'
import { Button } from '../components/UI/Button'
import { useDisc } from '../contexts/DiscContext'

export default function Summary() {
  const { info, questions, answers, setStep, setCurrent } = useDisc()
  if (!info) return null
  const rows: [string, string | undefined][] = [['Nom', info.nom], ['Post-nom', info.postNom], ['Prénom', info.prenom], ['Sexe', info.sexe], ['Naissance', info.dateNaissance], ['Téléphone', info.telephone], ['Email', info.email]]
  return <div className="w-full space-y-5">
    <Card><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-navy">Informations personnelles</h2>
      <Button variant="ghost" className="px-3 py-2 text-sm" onClick={() => setStep('info')}><Pencil size={14} />Modifier</Button></div>
      <dl className="grid gap-3 sm:grid-cols-2">{rows.filter(([, v]) => v).map(([k, v]) => <div key={k}><dt className="text-sm text-ink/60">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl></Card>
    <Card><h2 className="mb-4 text-xl font-bold text-navy">Vos réponses</h2>
      <ol className="divide-y divide-line">{questions.map((q, i) => { const o = q.options.find((x) => x.id === answers[q.id])
        return <li key={q.id} className="flex items-center justify-between gap-3 py-3"><span><b className="text-brand">{q.id}.</b> {o?.id.toUpperCase()} – {o?.label}</span>
          <button aria-label={`Modifier la question ${q.id}`} className="rounded-lg p-2 text-brand hover:bg-brand/10" onClick={() => { setCurrent(i); setStep('quiz') }}><Pencil size={16} /></button></li> })}</ol></Card>
    <div className="flex justify-between gap-3"><Button variant="ghost" onClick={() => { setCurrent(questions.length - 1); setStep('quiz') }}><RotateCcw size={16} />Retour</Button>
      <Button variant="accent" onClick={() => setStep('submitting')}>Soumettre <Send size={16} /></Button></div></div>
}
