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
    defineField({
      name: 'bannerContent',
      title: 'Banner Content',
      type: 'object',
      description: 'Heading and text displayed on all banner images',
      fields: [
        defineField({
          name: 'heading_en',
          title: 'Banner Heading (English)',
          type: 'string',
          description: 'Main heading text displayed on all banners',
        }),
        defineField({
          name: 'heading_fr',
          title: 'Banner Heading (French)',
          type: 'string',
          description: 'Main heading text displayed on all banners',
        }),
        defineField({
          name: 'text_en',
          title: 'Banner Text (English)',
          type: 'string',
          description: 'Subtitle or description text displayed on all banners',
        }),
        defineField({
          name: 'text_fr',
          title: 'Banner Text (French)',
          type: 'string',
          description: 'Subtitle or description text displayed on all banners',
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

