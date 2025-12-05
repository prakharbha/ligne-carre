import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'newsArticle',
  title: 'News Article',
  type: 'document',
  fields: [
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
      name: 'slug_en',
      title: 'Slug (English)',
      type: 'slug',
      options: {
        source: 'title_en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug_fr',
      title: 'Slug (French)',
      type: 'slug',
      options: {
        source: 'title_fr',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Publication Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt_en',
      title: 'Excerpt (English)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt_fr',
      title: 'Excerpt (French)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
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
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
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
          description: 'SEO title for search engines (50-60 characters recommended). If empty, uses article title.',
        }),
        defineField({
          name: 'metaTitle_fr',
          title: 'Meta Title (French)',
          type: 'string',
          description: 'SEO title for search engines (50-60 characters recommended). If empty, uses article title.',
        }),
        defineField({
          name: 'metaDescription_en',
          title: 'Meta Description (English)',
          type: 'text',
          rows: 3,
          description: 'SEO description for search engines (150-160 characters recommended). If empty, uses excerpt.',
        }),
        defineField({
          name: 'metaDescription_fr',
          title: 'Meta Description (French)',
          type: 'text',
          rows: 3,
          description: 'SEO description for search engines (150-160 characters recommended). If empty, uses excerpt.',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title_en',
      date: 'date',
      media: 'featuredImage',
    },
    prepare({ title, date, media }) {
      return {
        title: title || 'Untitled',
        subtitle: date ? new Date(date).toLocaleDateString() : '',
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Date (Newest)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Date (Oldest)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
});

