import {ActivityIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const readingProgressType = defineType({
  name: 'readingProgress',
  title: 'Reading Progress',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'References the user tracking this progress',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'book',
      title: 'Book',
      type: 'reference',
      to: [{type: 'book'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastPage',
      title: 'Last Page',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'bookmarks',
      title: 'Bookmarks',
      type: 'array',
      of: [{type: 'number'}],
      initialValue: [],
    }),
    defineField({
      name: 'totalMinutes',
      title: 'Total Minutes Read',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      bookTitle: 'book.title',
      userId: 'userId',
      lastPage: 'lastPage',
    },
    prepare({bookTitle, userId, lastPage}) {
      return {
        title: bookTitle ?? 'Reading Progress',
        subtitle: `User ${userId} — p.${lastPage ?? 0}`,
      }
    },
  },
})
