import cardImage1 from '../assets/blog/blog-card-1.png'
import cardImage2 from '../assets/blog/blog-card-2.png'
import cardImage3 from '../assets/blog/blog-card-3.png'
import cardImage4 from '../assets/blog/blog-card-4.png'
import cardImage5 from '../assets/blog/blog-card-5.png'
import cardImage6 from '../assets/blog/blog-card-6.png'
import cardImage7 from '../assets/blog/blog-card-7.png'
import cardImage8 from '../assets/blog/blog-card-8.png'
import cardImage9 from '../assets/blog/blog-card-9.png'
import authorAvatar from '../assets/blog/blog-author.jpg'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  author: string
  authorAvatar: string
  readTime: string
  image: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'understanding-narrowboat-hull-thickness',
    title: 'Understanding Narrowboat Hull Thickness',
    excerpt:
      'Of all the checks carried out during a pre-purchase narrowboat survey, hull thickness is one of the most important indicators of a boat’s condition and remaining lifespan.',
    date: 'Aug 26, 2026',
    category: 'Blog',
    author: 'Shumail.S',
    authorAvatar,
    readTime: '12 min read',
    image: cardImage1,
  },
  {
    slug: 'best-narrowboat-lengths-for-different-lifestyles',
    title: 'Best Narrowboat Lengths for Different Lifestyles',
    excerpt:
      'One of the first and most consequential questions any prospective owner faces is what length of narrowboat actually suits the way they intend to live and cruise.',
    date: 'Aug 26, 2026',
    category: 'Blog',
    author: 'Shumail.S',
    authorAvatar,
    readTime: '12 min read',
    image: cardImage2,
  },
  {
    slug: 'are-boat-brokerage-fees-worth-paying',
    title: 'Are Boat Brokerage Fees Worth Paying?',
    excerpt:
      'Are boat brokerage fees worth paying? Introduction: in a question almost every seller asks themselves at some point, we break down what a broker actually does for their fee.',
    date: 'Aug 26, 2026',
    category: 'Blog',
    author: 'Shumail.S',
    authorAvatar,
    readTime: '12 min read',
    image: cardImage3,
  },
  {
    slug: 'best-narrowboat-brokers-in-the-west-midlands',
    title: 'The Best Narrowboat Brokers in the West Midlands',
    excerpt:
      'If you are buying or selling a narrowboat in the West Midlands and you need a specialist who understands the local canal network, here is what to look for.',
    date: 'Aug 26, 2026',
    category: 'Blog',
    author: 'Shumail.S',
    authorAvatar,
    readTime: '12 min read',
    image: cardImage4,
  },
  {
    slug: 'complete-narrowboat-buying-checklist',
    title: 'The Complete Narrowboat Buying Checklist',
    excerpt:
      'Introduction: buying a used narrowboat is one of the most significant purchases you will make. Use this checklist to make sure nothing gets overlooked.',
    date: 'Aug 26, 2026',
    category: 'Blog',
    author: 'Shumail.S',
    authorAvatar,
    readTime: '12 min read',
    image: cardImage5,
  },
  {
    slug: 'selling-a-canal-boat-in-warwickshire',
    title: 'Selling a Canal Boat in Warwickshire: A Seller’s Guide',
    excerpt:
      'Introduction: Warwickshire sits as a compelling crossroads of the English canal network, and that connectivity has a direct impact on how quickly a boat sells.',
    date: 'Aug 26, 2026',
    category: 'Blog',
    author: 'Shumail.S',
    authorAvatar,
    readTime: '12 min read',
    image: cardImage6,
  },
  {
    slug: 'how-to-handle-a-narrowboat-viewing',
    title: 'How to Handle Narrowboat Viewings: A Buyer’s Guide',
    excerpt:
      'Introduction: a narrowboat viewing is the moment when a prospective buyer moves from browsing listings to seriously assessing a boat. Here is how to make the most of it.',
    date: 'Aug 26, 2026',
    category: 'Blog',
    author: 'Shumail.S',
    authorAvatar,
    readTime: '12 min read',
    image: cardImage7,
  },
  {
    slug: 'selling-a-canal-boat-in-worcester',
    title: 'Selling a Canal Boat in Worcester: What Owners Need to Know',
    excerpt:
      'Introduction: Worcester occupies a genuinely distinctive position on the canal network, and sellers who understand that position tend to achieve better results.',
    date: 'Aug 26, 2026',
    category: 'Blog',
    author: 'Shumail.S',
    authorAvatar,
    readTime: '12 min read',
    image: cardImage8,
  },
  {
    slug: 'narrowboats-for-sale-near-coventry',
    title: 'Narrowboats for Sale Near Coventry: A Buyer’s Guide',
    excerpt:
      'Coventry’s stretch of canal has quietly become one of the more sought-after areas for narrowboat buyers looking for accessible, well-connected moorings.',
    date: 'Aug 26, 2026',
    category: 'Blog',
    author: 'Shumail.S',
    authorAvatar,
    readTime: '12 min read',
    image: cardImage9,
  },
]
