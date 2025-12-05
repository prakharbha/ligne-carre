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
          { title: 'About', value: 'about' },
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
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle_en',
          title: 'Meta Title (English)',
          type: 'string',
          description: 'SEO title for search engines (50-60 characters recommended)',
        }),
        defineField({
          name: 'metaTitle_fr',
          title: 'Meta Title (French)',
          type: 'string',
          description: 'SEO title for search engines (50-60 characters recommended)',
        }),
        defineField({
          name: 'metaDescription_en',
          title: 'Meta Description (English)',
          type: 'text',
          rows: 3,
          description: 'SEO description for search engines (150-160 characters recommended)',
        }),
        defineField({
          name: 'metaDescription_fr',
          title: 'Meta Description (French)',
          type: 'text',
          rows: 3,
          description: 'SEO description for search engines (150-160 characters recommended)',
        }),
      ],
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

