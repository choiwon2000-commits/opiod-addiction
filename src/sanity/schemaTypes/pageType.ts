import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'book',
      title: 'Book',
      type: 'reference',
      to: [{type: 'book'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageNumber',
      title: 'Page Number',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'contentAst',
      title: 'Content AST',
      type: 'object',
      description: 'Blocks rendered on this page',
      fields: [
        defineField({name: 'data', type: 'string', title: 'Data'}),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'illustration',
      title: 'Illustration',
      type: 'reference',
      to: [{type: 'illustration'}],
    }),
  ],
  preview: {
    select: {
      bookTitle: 'book.title',
      pageNumber: 'pageNumber',
    },
    prepare({bookTitle, pageNumber}) {
      return {
        title: `Page ${pageNumber ?? '?'}`,
        subtitle: bookTitle ?? undefined,
      }
    },
  },
})
