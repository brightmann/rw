import { NextSeo } from 'next-seo'

import { SimpleLayout } from '@/components/SimpleLayout'
import { BlogList } from '@/components/BlogList'
import { Pagination } from '@/components/Pagination'
import {
  getDatabase,
  getPageArticles,
  getTotalPages,
} from '@/lib/notion'
import { baseUrl } from '../../../seo.config'

export default function BlogPage({ articles, currentPage, totalPages }) {
  return (
    <>
      <NextSeo
        title={`Blog — Page ${currentPage}`}
        description="This is a collection of my long-form thoughts on Web Dev, AI, Blockchains, and more in various stages of completion from Seedling to Evergreen."
        canonical={`${baseUrl}blog/page/${currentPage}/`}
        openGraph={{
          url: `${baseUrl}blog/page/${currentPage}/`,
          title: `Blog — Page ${currentPage}`,
          description:
            'This is a collection of my long-form thoughts on Web Dev, AI, Blockchains, and more in various stages of completion from Seedling to Evergreen.',
          images: [
            {
              url: `${baseUrl}api/og?title=Blog`,
              width: 1200,
              height: 600,
              alt: `Blog | Rittik Basu`,
            },
          ],
        }}
      />
      <SimpleLayout
        title="Welcome to my"
        postTitle="Digital Garden."
        intro="This is a collection of my long-form thoughts on Web Dev, AI, Blockchains, and more in various stages of completion from Seedling to Evergreen. I hope you find something that piques your interest."
      >
        <BlogList articles={articles} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </SimpleLayout>
    </>
  )
}

export const getStaticPaths = async () => {
  const databaseId = process.env.NOTION_BLOG_DB_ID
  const database = await getDatabase(databaseId, 'date', 'descending')
  const totalPages = getTotalPages(database.length)

  // Page 1 lives at /blog; only generate pages 2..N here.
  const paths = []
  for (let page = 2; page <= totalPages; page++) {
    paths.push({ params: { page: String(page) } })
  }

  return { paths, fallback: false }
}

export const getStaticProps = async (context) => {
  const currentPage = parseInt(context.params.page, 10)
  const databaseId = process.env.NOTION_BLOG_DB_ID
  const database = await getDatabase(databaseId, 'date', 'descending')
  const totalPages = getTotalPages(database.length)

  if (Number.isNaN(currentPage) || currentPage < 2 || currentPage > totalPages) {
    return { notFound: true }
  }

  return {
    props: {
      articles: getPageArticles(database, currentPage),
      currentPage,
      totalPages,
    },
  }
}
