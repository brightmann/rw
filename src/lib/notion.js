import { Client } from '@notionhq/client'
import slugify from 'slugify'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// The URL slug for a post comes from the `slug` column in Notion.
// Falls back to a slugified title, then to the page id, so a
// Chinese-only title (which slugifies to an empty string) never
// produces an empty path that collides with /blog.
export const getArticleSlug = (article) => {
  const slugProp = article.properties?.slug?.rich_text?.[0]?.plain_text
  if (slugProp) return slugProp
  const fromTitle = slugify(
    article.properties?.name?.title?.[0]?.plain_text || '',
    { strict: true, lower: true }
  )
  return fromTitle || article.id
}

export const POSTS_PER_PAGE = 6

export const getTotalPages = (totalArticles) =>
  Math.max(1, Math.ceil(totalArticles / POSTS_PER_PAGE))

export const getPageArticles = (database, page) => {
  const start = (page - 1) * POSTS_PER_PAGE
  return database.slice(start, start + POSTS_PER_PAGE)
}

export const getDatabase = async (databaseId, sortProperty, sort) => {
  // Shell mode: Notion not wired yet — return an empty list so the
  // portfolio builds and deploys without a token/database.
  if (!process.env.NOTION_TOKEN || !databaseId) {
    return []
  }
  // const response = await notion.databases.query({
  //   database_id: databaseId,
  // });
  const env = process.env.NODE_ENV
  const status = env === 'development' ? 'preview' : 'publish'
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        {
          property: status,
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: sortProperty,
        direction: sort,
      },
    ],
  })
  // remove databaseId from response
  response.results.forEach((result) => {
    delete result.parent.database_id
  })
  return response.results
}

export const getPage = async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId })
  return response
}

export const getBlocks = async (blockId) => {
  const blocks = []
  let cursor
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })
    blocks.push(...results)
    if (!next_cursor) {
      break
    }
    cursor = next_cursor
  }
  return blocks
}
