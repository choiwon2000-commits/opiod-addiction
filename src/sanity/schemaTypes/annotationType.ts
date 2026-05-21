import {EditIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const annotationType = defineType({
  name: 'annotation',
  title: 'Annotation',
  type: 'document',
  icon: EditIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'References the user who created this annotation',
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
      name: 'pageNumber',
      title: 'Page Number',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'selection',
      title: 'Selection',
      type: 'text',
      description: 'Highlighted text the annotation refers to',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      initialValue: 'amber',
      options: {
        list: [
          {title: 'Amber', value: 'amber'},
          {title: 'Blue', value: 'blue'},
          {title: 'Green', value: 'green'},
          {title: 'Pink', value: 'pink'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      bookTitle: 'book.title',
      pageNumber: 'pageNumber',
      note: 'note',
    },
    prepare({bookTitle, pageNumber, note}) {
      return {
        title: note ? note.slice(0, 60) : 'Annotation',
        subtitle: bookTitle ? `${bookTitle} — p.${pageNumber ?? '?'}` : undefined,
      }
    },
  },
})
