import type { Card } from '../../data/types'
import { CardItem } from './CardItem'

type Props = {
  cards: Card[]
}

export function CardGrid({ cards }: Props) {
  return (
    <ul className="card-grid">
      {cards.map((card) => (
        <li key={card.id} className="card-grid__cell">
          <CardItem card={card} />
        </li>
      ))}
    </ul>
  )
}
