import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pageContent',
  title: 'Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Careers', value: 'careers' },
          { title: 'Contact', value: 'contact' },
          { title: 'Privacy Policy', value: 'privacy' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title_fr',
      title: 'Title (French)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle_en',
      title: 'Subtitle (English)',
      type: 'string',
    }),
    defineField({
      name: 'subtitle_fr',
      title: 'Subtitle (French)',
      type: 'string',
    }),
    defineField({
      name: 'content_en',
      title: 'Content (English)',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content_fr',
      title: 'Content (French)',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title_en',
      pageType: 'pageType',
    },
    prepare({ title, pageType }) {
      return {
        title: title || 'Untitled',
        subtitle: pageType ? pageType.charAt(0).toUpperCase() + pageType.slice(1) : '',
      };
    },
  },
});

