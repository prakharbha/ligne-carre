import { client } from '../sanity/lib/client';

async function checkFeaturedItems() {
  try {
    // Get all portfolio items with their featured status
    const allItems = await client.fetch(`
      *[_type == "portfolioItem"] | order(order asc) {
        _id,
        title_en,
        title_fr,
        featured,
        order
      }
    `);

    console.log('\n=== All Portfolio Items ===');
    console.log(`Total items: ${allItems.length}\n`);

    const featuredItems = allItems.filter((item: any) => item.featured === true);
    const nonFeaturedItems = allItems.filter((item: any) => item.featured !== true);

    console.log('=== Featured Items (featured === true) ===');
    console.log(`Count: ${featuredItems.length}\n`);
    featuredItems.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${item.title_en || item.title_fr || 'Untitled'}`);
      console.log(`   ID: ${item._id}`);
      console.log(`   Order: ${item.order}`);
      console.log(`   Featured: ${item.featured}`);
      console.log('');
    });

    console.log('=== Non-Featured Items ===');
    console.log(`Count: ${nonFeaturedItems.length}\n`);
    nonFeaturedItems.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${item.title_en || item.title_fr || 'Untitled'}`);
      console.log(`   Featured: ${item.featured} (type: ${typeof item.featured})`);
      console.log('');
    });

    // Test the actual query used on homepage
    const queryResults = await client.fetch(`
      *[_type == "portfolioItem" && featured == true] | order(order asc) {
        _id,
        title_en,
        title_fr,
        featured,
        order
      }
    `);

    console.log('=== Query Results (featured == true) ===');
    console.log(`Count: ${queryResults.length}\n`);
    queryResults.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${item.title_en || item.title_fr || 'Untitled'}`);
      console.log(`   ID: ${item._id}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error checking featured items:', error);
  }
}

checkFeaturedItems();

