const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const BLOGS_JSON = path.resolve(__dirname, 'seed-data', 'blogs.json');

async function main() {
  const blogs = JSON.parse(fs.readFileSync(BLOGS_JSON, 'utf8'));

  for (const blog of blogs) {
    const post = await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        content: blog.content,
        readTime: blog.readTime,
        author: blog.author,
        date: blog.date,
        imageUrl: blog.imageUrl,
      },
      create: {
        slug: blog.slug,
        title: blog.title,
        content: blog.content,
        readTime: blog.readTime,
        author: blog.author,
        date: blog.date,
        imageUrl: blog.imageUrl,
      },
    });
    console.log(`Seeded: ${post.slug}`);
  }

  console.log(`\nDone. ${blogs.length} blog posts seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
