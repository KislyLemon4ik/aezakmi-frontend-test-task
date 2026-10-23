import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { KanbanCard } from '../types/card'

type CardsContextValue = {
  cards: KanbanCard[]
  addCard: (card: KanbanCard) => void
  updateCard: (card: KanbanCard) => void
  getCardById: (id: string) => KanbanCard | undefined
}

const CardsContext = createContext<CardsContextValue | null>(null)

type CardsProviderProps = {
  children: ReactNode
}

export function CardsProvider({ children }: CardsProviderProps) {
  const [cards, setCards] = useState<KanbanCard[]>([])

  const addCard = useCallback((card: KanbanCard) => {
    setCards((prev) => [...prev, card])
  }, [])

  const updateCard = useCallback((card: KanbanCard) => {
    setCards((prev) => prev.map((item) => (item.id === card.id ? card : item)))
  }, [])

  const getCardById = useCallback(
    (id: string) => cards.find((card) => card.id === id),
    [cards],
  )

  const value = useMemo(
    () => ({
      cards,
      addCard,
      updateCard,
      getCardById,
    }),
    [cards, addCard, updateCard, getCardById],
  )

  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>
}

export function useCards() {
  const context = useContext(CardsContext)

  if (!context) {
    throw new Error('useCards must be used inside CardsProvider')
  }

  return context
}
