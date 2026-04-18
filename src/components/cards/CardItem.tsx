import type { Card } from '../../data/types'

type Props = {
  card: Card
}

export function CardItem({ card }: Props) {
  return (
    <article className="card-item">
      <div className="card-item__frame">
        <img
          className="card-item__img"
          src={card.imageUrl}
          alt={`${card.name} trading card`}
          loading="lazy"
          width={245}
          height={342}
        />
      </div>
      <h2 className="card-item__title">{card.name}</h2>
      {(card.setName || card.rarity) && (
        <p className="card-item__meta">
          {[card.setName, card.rarity].filter(Boolean).join(' · ')}
        </p>
      )}
    </article>
  )
}
