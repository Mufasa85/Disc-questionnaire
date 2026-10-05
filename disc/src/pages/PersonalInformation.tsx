import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronRight, User } from '../components/Icons'
import { Card } from '../components/UI/Card'
import { Button } from '../components/UI/Button'
import { Input } from '../components/UI/Input'
import { useDisc } from '../contexts/DiscContext'
import { useBeforeUnload } from '../hooks/useBeforeUnload'

const schema = z.object({
  nom: z.string().trim().min(2, 'Le nom est requis (2 caractères min.)'),
  postNom: z.string().trim().min(2, 'Le post-nom est requis'),
  prenom: z.string().trim().min(2, 'Le prénom est requis'),
  sexe: z.enum(['Homme', 'Femme'], { errorMap: () => ({ message: 'Sélectionnez une option' }) }),
  dateNaissance: z.string().min(1, 'La date de naissance est requise').refine((d) => new Date(d) < new Date(), 'Date invalide'),
  telephone: z.string().regex(/^[+\d\s()-]{6,20}$/, 'Numéro invalide').optional().or(z.literal('')),
  email: z.string().email('Adresse e-mail invalide').optional().or(z.literal('')),
})

export default function PersonalInformation() {
  const { info, setInfo, setStep } = useDisc()
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: info ?? undefined })
  useBeforeUnload(isDirty)
  return <Card>
    <div className="mb-6 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-accent text-navy"><User /></span>
      <div><h2 className="text-2xl font-bold text-navy">Informations personnelles</h2><p className="text-sm text-ink/60">Étape 1 sur 3</p></div></div>
    <form noValidate onSubmit={handleSubmit((d) => { setInfo(d); setStep('quiz') })} className="grid gap-5 sm:grid-cols-2">
      <Input id="nom" label="Nom" error={errors.nom?.message} {...register('nom')} />
      <Input id="postNom" label="Post-nom" error={errors.postNom?.message} {...register('postNom')} />
      <Input id="prenom" label="Prénom" error={errors.prenom?.message} {...register('prenom')} />
      <fieldset><legend className="mb-1.5 text-sm font-medium text-navy">Sexe</legend>
        <div className="flex gap-3">{(['Homme', 'Femme'] as const).map((s) =>
          <label key={s} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 has-[:checked]:border-brand has-[:checked]:bg-brand/5 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent">
            <input type="radio" value={s} className="accent-brand" {...register('sexe')} />{s}</label>)}</div>
        {errors.sexe && <p role="alert" className="mt-1 text-sm text-danger">{errors.sexe.message}</p>}</fieldset>
      <Input id="dob" type="date" label="Date de naissance" error={errors.dateNaissance?.message} {...register('dateNaissance')} />
      <Input id="tel" type="tel" label="Téléphone (optionnel)" error={errors.telephone?.message} {...register('telephone')} />
      <div className="sm:col-span-2"><Input id="email" type="email" label="Email (optionnel)" error={errors.email?.message} {...register('email')} /></div>
      <Button type="submit" className="sm:col-span-2">Continuer <ChevronRight size={18} /></Button>
    </form></Card>
}
