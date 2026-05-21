import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const bookType = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'markdownUri',
      title: 'Markdown URI',
      type: 'string',
      description: 'S3 path to the source markdown file',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'astCache',
      title: 'AST Cache',
      type: 'object',
      description: 'Parsed AST for fast re-render',
      fields: [
        defineField({name: 'data', type: 'string', title: 'Data'}),
      ],
    }),
    defineField({
      name: 'cover',
      title: 'Cover',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'material',
          title: 'Material',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'color',
          title: 'Color',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'emboss',
          title: 'Emboss',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'paper',
      title: 'Paper',
      type: 'string',
      options: {
        list: [
          {title: 'Ivory', value: 'ivory'},
          {title: 'Vellum', value: 'vellum'},
          {title: 'Coated', value: 'coated'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'illustStyle',
      title: 'Illustration Style',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shelfOrder',
      title: 'Shelf Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'totalPages',
      title: 'Total Pages',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author',
    },
    prepare({title, subtitle}) {
      return {
        title: title ?? 'Untitled Book',
        subtitle: subtitle ? `by ${subtitle}` : undefined,
      }
    },
  },
})
