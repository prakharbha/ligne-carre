import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_formPreviewTitle: false,
  fields: [
    defineField({
      name: 'footerContact',
      title: 'Footer Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'address_en',
          title: 'Address (English)',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'address_fr',
          title: 'Address (French)',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule) => Rule.required().email(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'homepageCopy',
      title: 'Homepage Copy',
      type: 'object',
      fields: [
        defineField({
          name: 'aboutImage',
          title: 'About Section Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'aboutDescription_en',
          title: 'About Description (English)',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'aboutDescription_fr',
          title: 'About Description (French)',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'careersDescription_en',
          title: 'Careers Description (English)',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'careersDescription_fr',
          title: 'Careers Description (French)',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      };
    },
  },
});

