export type CardPriority = 'Low' | 'Medium' | 'High'
export type CardStatus = 'To Do' | 'In Progress' | 'Done'

export type CardImage = {
  id: string
  name: string
  url: string
}

export type KanbanCard = {
  id: string
  title: string
  description: string
  priority: CardPriority
  status: CardStatus
  assignee: string
  deadline: string
  tags: string[]
  images: CardImage[]
}

export type CardFormValues = {
  title: string
  description: string
  priority: CardPriority | ''
  status: CardStatus | ''
  assignee: string
  deadline: string
}

export const PRIORITY_OPTIONS: CardPriority[] = ['Low', 'Medium', 'High']
export const STATUS_OPTIONS: CardStatus[] = ['To Do', 'In Progress', 'Done']
export const ASSIGNEE_OPTIONS = [
  'Alex Johnson',
  'Maria Chen',
  'John Smith',
  'Emma Wilson',
]

export const TAG_COLORS = ['#efe7ff', '#e7f0ff', '#ffe7ea']
