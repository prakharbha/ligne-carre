import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pageBanner',
  title: 'Page Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'About', value: 'about' },
          { title: 'Services', value: 'services' },
          { title: 'Portfolio (Listing)', value: 'portfolio' },
          { title: 'News (Listing)', value: 'news' },
          { title: 'Contact', value: 'contact' },
          { title: 'Careers', value: 'careers' },
          { title: 'Privacy Policy', value: 'privacy' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altText_en',
      title: 'Alt Text (English)',
      type: 'string',
    }),
    defineField({
      name: 'altText_fr',
      title: 'Alt Text (French)',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      pageType: 'pageType',
      media: 'image',
    },
    prepare({ pageType, media }) {
      return {
        title: pageType ? pageType.charAt(0).toUpperCase() + pageType.slice(1) + ' Page Banner' : 'Page Banner',
        media,
      };
    },
  },
});

