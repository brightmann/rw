import { BlogCard } from '@/components/BlogCard'
import { getArticleSlug } from '@/lib/notion'

function distributeToColumns(items, numColumns) {
  const columns = Array.from({ length: numColumns }, () => [])

  items.forEach((item, index) => {
    columns[index % numColumns].push(item)
  })

  return columns
}

function renderColumns(columns) {
  return columns.map((column, columnIndex) => (
    <div key={`column-${columnIndex}`} className="space-y-10">
      {column.map(({ article, slug }) => (
        <BlogCard key={article.id ?? slug} article={article} slug={slug} />
      ))}
    </div>
  ))
}

export function BlogList({ articles }) {
  const articleCards = articles.map((article) => ({
    article,
    slug: getArticleSlug(article),
  }))

  const tabletColumns = distributeToColumns(articleCards, 2)
  const desktopColumns = distributeToColumns(articleCards, 3)

  return (
    <>
      <div className="space-y-10 md:hidden">
        {articleCards.map(({ article, slug }) => (
          <BlogCard key={article.id ?? slug} article={article} slug={slug} />
        ))}
      </div>
      <div className="hidden grid-cols-2 gap-6 md:grid lg:hidden">
        {renderColumns(tabletColumns)}
      </div>
      <div className="hidden grid-cols-3 gap-6 lg:grid">
        {renderColumns(desktopColumns)}
      </div>
    </>
  )
}
