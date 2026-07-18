import {
  Code2,
  Sparkles,
  Bot,
  Wand2,
  BookOpenText,
  Guitar,
  Dumbbell,
  CalendarClock,
  Library,
} from 'lucide-react'

const futureModules = [
  { label: 'Engenharia', icon: Code2 },
  { label: 'IA e prompts', icon: Sparkles },
  { label: 'Harnesses', icon: Bot },
  { label: 'Skills', icon: Wand2 },
  { label: 'Estudos de caso', icon: BookOpenText },
  { label: 'Violão', icon: Guitar },
  { label: 'Exercícios', icon: Dumbbell },
  { label: 'Cronograma', icon: CalendarClock },
  { label: 'Base de conhecimento', icon: Library },
]

export function FutureModulesGrid() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Em breve
      </h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {futureModules.map((module) => (
          <div
            key={module.label}
            className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs font-medium text-slate-400 dark:border-slate-700 dark:text-slate-500"
          >
            <module.icon className="size-5" aria-hidden="true" />
            {module.label}
          </div>
        ))}
      </div>
    </section>
  )
}
