import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NotebookPen } from 'lucide-react'
import { useNotes } from '../features/notes/hooks/useNotes'
import { NoteCard } from '../features/notes/components/NoteCard'
import { NOTE_CATEGORIES } from '../features/notes/types/noteCategories'
import { EmptyState } from '../components/feedback/EmptyState'
import { FullScreenSpinner } from '../components/feedback/FullScreenSpinner'
import { Button } from '../components/ui/Button'
import { TextField } from '../components/forms/TextField'
import { SelectField } from '../components/forms/SelectField'

export function NotesListPage() {
  const { data: notes, isLoading, isError } = useNotes()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const filteredNotes = useMemo(() => {
    if (!notes) return []
    return notes.filter((note) => {
      const matchesSearch =
        !search ||
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !category || note.category === category
      return matchesSearch && matchesCategory
    })
  }, [notes, search, category])

  if (isLoading) return <FullScreenSpinner label="Carregando anotações…" />

  if (isError) {
    return (
      <EmptyState
        icon={NotebookPen}
        title="Não foi possível carregar suas anotações"
        description="Verifique sua conexão e tente novamente."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Anotações
        </h1>
        <Link to="/app/anotacoes/nova">
          <Button size="sm">Nova anotação</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_200px]">
        <TextField
          label="Buscar"
          placeholder="Buscar por título ou conteúdo"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <SelectField
          label="Categoria"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Todas</option>
          {NOTE_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </SelectField>
      </div>
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title={
            notes && notes.length > 0
              ? 'Nenhuma anotação encontrada'
              : 'Nenhuma anotação ainda'
          }
          description={
            notes && notes.length > 0
              ? 'Ajuste a busca ou o filtro de categoria.'
              : 'Crie sua primeira anotação para começar.'
          }
          action={
            notes && notes.length === 0 ? (
              <Link to="/app/anotacoes/nova">
                <Button size="sm">Nova anotação</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}
