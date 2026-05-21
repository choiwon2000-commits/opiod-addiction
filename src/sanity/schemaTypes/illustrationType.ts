import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const illustrationType = defineType({
  name: 'illustration',
  title: 'Illustration',
  type: 'document',
  icon: ImageIcon,
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
    }),
    defineField({
      name: 'prompt',
      title: 'Prompt',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'assetUri',
      title: 'Asset URI',
      type: 'string',
      description: 'S3 path to the illustration asset',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'generatedAt',
      title: 'Generated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'style',
      subtitle: 'book.title',
      pageNumber: 'pageNumber',
    },
    prepare({title, subtitle, pageNumber}) {
      return {
        title: title ?? 'Illustration',
        subtitle: subtitle ? `${subtitle} — p.${pageNumber ?? '?'}` : undefined,
      }
    },
  },
})
