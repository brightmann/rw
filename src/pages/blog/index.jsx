import { NextSeo } from 'next-seo'

import { SimpleLayout } from '@/components/SimpleLayout'
import { BlogList } from '@/components/BlogList'
import { Pagination } from '@/components/Pagination'
import {
  getDatabase,
  getPageArticles,
  getTotalPages,
} from '@/lib/notion'
import { baseUrl } from '../../seo.config'

export default function Blog({ articles, totalPages }) {
  return (
    <>
      <NextSeo
        title="Blog"
        description="This is a collection of my long-form thoughts on Web Dev, AI, Blockchains, and more in various stages of completion from Seedling to Evergreen."
        canonical={`${baseUrl}blog/`}
        openGraph={{
          url: `${baseUrl}blog/`,
          title: 'Blog',
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
        <Pagination currentPage={1} totalPages={totalPages} />
      </SimpleLayout>
    </>
  )
}
export const getStaticProps = async () => {
  const databaseId = process.env.NOTION_BLOG_DB_ID
  const database = await getDatabase(databaseId, 'date', 'descending')

  return {
    props: {
      articles: getPageArticles(database, 1),
      totalPages: getTotalPages(database.length),
    },
  }
}
