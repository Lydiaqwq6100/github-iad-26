import {defineField, defineType} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'workCategory'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'awardNote',
      title: 'Award / Recognition Note',
      type: 'string',
      description: 'Optional italic note shown below the description',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'Optional heading above this item',
            }),
            defineField({
              name: 'image',
              title: 'Preview Image',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'linkLabel',
              title: 'Link Label',
              type: 'string',
              description: 'e.g. "Open Makan 1 in a new tab"',
            }),
            defineField({
              name: 'linkUrl',
              title: 'Link URL',
              type: 'url',
              description: 'External URL or uploaded file URL from Sanity assets',
            }),
            defineField({
              name: 'file',
              title: 'File (PDF, etc.)',
              type: 'file',
              description: 'Upload a PDF or other file instead of using a URL',
            }),
          ],
          preview: {
            select: {title: 'title', media: 'image'},
            prepare({title, media}) {
              return {title: title || 'Gallery item', media}
            },
          },
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Category Page',
      type: 'boolean',
      description: 'When a category has multiple projects, featured ones appear first',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      media: 'gallery.0.image',
    },
    prepare({title, category, media}) {
      return {
        title,
        subtitle: category,
        media,
      }
    },
  },
})
