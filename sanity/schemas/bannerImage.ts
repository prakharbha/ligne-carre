import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'bannerImage',
  title: 'Banner Image',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'altText_en',
      title: 'Alt Text (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altText_fr',
      title: 'Alt Text (French)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'altText_en',
      media: 'image',
      order: 'order',
    },
    prepare({ title, media, order }) {
      return {
        title: `${order || '?'}. ${title || 'Untitled'}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});

