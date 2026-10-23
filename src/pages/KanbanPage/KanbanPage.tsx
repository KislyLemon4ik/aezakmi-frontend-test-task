import { useMemo, useRef, useState, type DragEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useCards } from '../../context/CardsContext'
import {
  ASSIGNEE_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  TAG_COLORS,
  type CardFormValues,
  type CardImage,
  type CardPriority,
  type CardStatus,
  type KanbanCard,
} from '../../types/card'
import './KanbanPage.css'

type ViewMode = 'form' | 'preview' | 'list'

const emptyFormValues: CardFormValues = {
  title: '',
  description: '',
  priority: '',
  status: '',
  assignee: '',
  deadline: '',
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function formatDeadline(value: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function buildAlertText(card: KanbanCard) {
  return [
    `Title: ${card.title}`,
    `Description: ${card.description}`,
    `Priority: ${card.priority}`,
    `Status: ${card.status || '—'}`,
    `Assignee: ${card.assignee || '—'}`,
    `Deadline: ${formatDeadline(card.deadline)}`,
    `Tags: ${card.tags.length ? card.tags.join(', ') : '—'}`,
    `Images: ${card.images.length ? card.images.map((img) => img.name).join(', ') : '—'}`,
  ].join('\n')
}

function readFileAsDataUrl(file: File): Promise<CardImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve({
        id: createId(),
        name: file.name,
        url: String(reader.result),
      })
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function KanbanPage() {
  const { cards, addCard, updateCard, getCardById } = useCards()
  const [view, setView] = useState<ViewMode>('form')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagDraft, setTagDraft] = useState('')
  const [images, setImages] = useState<CardImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardFormValues>({
    defaultValues: emptyFormValues,
  })

  const previewCard = useMemo(
    () => (previewId ? getCardById(previewId) : undefined),
    [previewId, getCardById, cards],
  )

  const openCreateForm = () => {
    setEditingId(null)
    setTags([])
    setTagDraft('')
    setImages([])
    reset(emptyFormValues)
    setView('form')
  }

  const openEditForm = (card: KanbanCard) => {
    setEditingId(card.id)
    setTags(card.tags)
    setTagDraft('')
    setImages(card.images.map((image) => ({ ...image })))
    reset({
      title: card.title,
      description: card.description,
      priority: card.priority,
      status: card.status,
      assignee: card.assignee,
      deadline: card.deadline,
    })
    setView('form')
  }

  const addImages = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/'),
    )

    if (imageFiles.length === 0) return

    const next = await Promise.all(imageFiles.map((file) => readFileAsDataUrl(file)))
    setImages((prev) => [...prev, ...next])
  }

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id))
  }

  const commitTagDraft = () => {
    const value = tagDraft.trim()
    if (!value) {
      setTagDraft('')
      return
    }
    setTags((prev) => (prev.includes(value) ? prev : [...prev, value]))
    setTagDraft('')
  }

  const onSubmit = (values: CardFormValues) => {
    const card: KanbanCard = {
      id: editingId ?? createId(),
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority as CardPriority,
      status: (values.status || 'To Do') as CardStatus,
      assignee: values.assignee,
      deadline: values.deadline,
      tags: [...tags],
      images: images.map((image) => ({ ...image })),
    }

    window.alert(buildAlertText(card))

    if (editingId) {
      updateCard(card)
    } else {
      addCard(card)
    }

    setPreviewId(card.id)
    setView('preview')
  }

  const handleCancel = () => {
    if (cards.length === 0) {
      window.alert('Create at least one card first')
      return
    }
    setView('list')
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (event.dataTransfer.files?.length) {
      void addImages(event.dataTransfer.files)
    }
  }

  if (view === 'list') {
    return (
      <section className="kanban-page">
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <h1 className="kanban-title">Cards</h1>
          <button className="kanban-btn kanban-btn--primary" type="button" onClick={openCreateForm}>
            Create New Card
          </button>
        </header>

        <div className="kanban-card">
          <div className="kanban-list">
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                className="kanban-list-item"
                onClick={() => {
                  setPreviewId(card.id)
                  setView('preview')
                }}
              >
                <div>
                  <h3>{card.title}</h3>
                  <p>
                    {card.priority} · {card.status || 'To Do'} · {card.assignee || 'Unassigned'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (view === 'preview' && previewCard) {
    return (
      <section className="kanban-page">
        <h1 className="kanban-title">Card Preview</h1>
        <div className="kanban-card">
          <div className="kanban-preview-badges">
            <span className="kanban-badge kanban-badge--status">
              {previewCard.status || 'To Do'}
            </span>
            <span className="kanban-badge kanban-badge--priority">
              {previewCard.priority === 'High' ? '🔥 ' : ''}
              {previewCard.priority}
            </span>
          </div>

          <h2 className="kanban-preview-title">{previewCard.title}</h2>
          <p className="kanban-preview-description">{previewCard.description}</p>

          <div className="kanban-preview-meta">
            <div>
              <span>ASSIGNEE</span>
              <strong>{previewCard.assignee || '—'}</strong>
            </div>
            <div>
              <span>DEADLINE</span>
              <strong>{formatDeadline(previewCard.deadline)}</strong>
            </div>
          </div>

          {previewCard.tags.length > 0 ? (
            <div className="kanban-preview-tags">
              {previewCard.tags.map((tag, index) => (
                <span
                  key={tag}
                  className="kanban-tag"
                  style={{ background: TAG_COLORS[index % TAG_COLORS.length] }}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {previewCard.images.length > 0 ? (
            <div className="kanban-preview-images">
              {previewCard.images.map((image) => (
                <img key={image.id} src={image.url} alt={image.name} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="kanban-actions">
          <button
            className="kanban-btn kanban-btn--secondary"
            type="button"
            onClick={openCreateForm}
          >
            ← Back to Form
          </button>
          <button
            className="kanban-btn kanban-btn--primary"
            type="button"
            onClick={() => openEditForm(previewCard)}
          >
            Edit Card
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="kanban-page">
      <h1 className="kanban-title">
        {editingId ? 'Edit Card' : 'Create New Card'}
      </h1>

      <form className="kanban-card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="kanban-form-grid">
          <div className="kanban-form-column">
            <div className="kanban-field">
              <label className="kanban-label" htmlFor="title">
                Title <span className="kanban-required">*</span>
              </label>
              <input
                id="title"
                className={errors.title ? 'kanban-input kanban-input--error' : 'kanban-input'}
                placeholder="Enter card title"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title ? <span className="kanban-error">{errors.title.message}</span> : null}
            </div>

            <div className="kanban-field">
              <label className="kanban-label" htmlFor="description">
                Description <span className="kanban-required">*</span>
              </label>
              <textarea
                id="description"
                className={
                  errors.description
                    ? 'kanban-textarea kanban-textarea--error'
                    : 'kanban-textarea'
                }
                placeholder="Enter detailed description..."
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description ? (
                <span className="kanban-error">{errors.description.message}</span>
              ) : null}
            </div>

            <div className="kanban-field">
              <label className="kanban-label" htmlFor="priority">
                Priority <span className="kanban-required">*</span>
              </label>
              <select
                id="priority"
                className={
                  errors.priority ? 'kanban-select kanban-select--error' : 'kanban-select'
                }
                {...register('priority', { required: 'Please select a priority' })}
              >
                <option value="">Select priority</option>
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.priority ? (
                <span className="kanban-error">{errors.priority.message}</span>
              ) : null}
            </div>

            <div className="kanban-field">
              <label className="kanban-label" htmlFor="status">
                Status
              </label>
              <select id="status" className="kanban-select" {...register('status')}>
                <option value="">Select status</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="kanban-form-column">
            <div className="kanban-field">
              <label className="kanban-label" htmlFor="assignee">
                Assignee
              </label>
              <select id="assignee" className="kanban-select" {...register('assignee')}>
                <option value="">Select assignee</option>
                {ASSIGNEE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="kanban-field">
              <label className="kanban-label" htmlFor="deadline">
                Deadline
              </label>
              <div className="kanban-deadline-wrap">
                <input
                  id="deadline"
                  type="date"
                  className="kanban-input"
                  {...register('deadline')}
                />
                <span className="kanban-deadline-icon" aria-hidden="true">
                  📅
                </span>
              </div>
            </div>

            <div className="kanban-field">
              <label className="kanban-label" htmlFor="tags">
                Tags
              </label>
              <div className="kanban-tags-box">
                {tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="kanban-tag"
                    style={{ background: TAG_COLORS[index % TAG_COLORS.length] }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((item) => item !== tag))}
                      aria-label={`Remove ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="tags"
                  className="kanban-tags-input"
                  placeholder="Add tags..."
                  value={tagDraft}
                  onChange={(event) => {
                    const value = event.target.value
                    if (value.endsWith(' ')) {
                      const next = value.trim()
                      if (next) {
                        setTags((prev) => (prev.includes(next) ? prev : [...prev, next]))
                      }
                      setTagDraft('')
                      return
                    }
                    setTagDraft(value)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      commitTagDraft()
                    }
                  }}
                  onBlur={commitTagDraft}
                />
              </div>
            </div>

            <div className="kanban-field">
              <label className="kanban-label">
                Images {images.length > 0 ? `(${images.length})` : ''}
              </label>

              {images.length > 0 ? (
                <div className="kanban-images">
                  {images.map((image) => (
                    <div key={image.id} className="kanban-image-item">
                      <div className="kanban-image-thumb">
                        <img src={image.url} alt={image.name} />
                        <button
                          type="button"
                          className="kanban-image-remove"
                          onClick={() => removeImage(image.id)}
                          aria-label={`Remove ${image.name}`}
                        >
                          🗑
                        </button>
                      </div>
                      <div className="kanban-image-name">{image.name}</div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div
                className={
                  isDragging ? 'kanban-dropzone kanban-dropzone--active' : 'kanban-dropzone'
                }
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div>☁️</div>
                <div>
                  Drag & drop images here or <strong>click to browse</strong>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(event) => {
                  if (event.target.files) void addImages(event.target.files)
                  event.target.value = ''
                }}
              />
            </div>
          </div>
        </div>

        <div className="kanban-actions">
          <button className="kanban-btn kanban-btn--secondary" type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button className="kanban-btn kanban-btn--primary" type="submit">
            {editingId ? 'Save Card' : 'Create Card'}
          </button>
        </div>
      </form>
    </section>
  )
}
