import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Lydia Liu',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      initialValue: 'Get to know me and my work ♡',
    }),
    defineField({
      name: 'navIcon',
      title: 'Navigation Icon',
      type: 'image',
      description: 'Small decorative icon used in navigation links',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'aboutPhoto',
      title: 'About Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'aboutBio',
      title: 'About Bio',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'Display handle without @',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'period',
              title: 'Period',
              type: 'string',
              description: 'e.g. 2022-2025',
            }),
            defineField({
              name: 'title',
              title: 'Degree / Qualification',
              type: 'string',
            }),
            defineField({
              name: 'institution',
              title: 'Institution',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'period'},
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
