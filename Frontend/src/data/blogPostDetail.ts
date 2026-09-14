import heroImage from '../assets/blog/blog-card-1.png'
import inlineImage from '../assets/blog/blog-detail-inline.png'
import authorAvatar from '../assets/blog/blog-detail-author.png'

export type BlogPostSection = {
  id: string
  heading: string
  paragraphs: string[]
  image?: string
}

export type BlogPostFaq = {
  question: string
  answer: string
}

export type BlogPostDetail = {
  slug: string
  title: string
  date: string
  category: string
  author: string
  commentsCount: number
  heroImage: string
  toc: { id: string; label: string }[]
  intro: string[]
  midCta: {
    heading: string
    description: string
    phone: string
    linkLabel: string
  }
  sections: BlogPostSection[]
  closingCta: {
    heading: string
    description: string
    phone: string
    linkLabel: string
  }
  faqs: BlogPostFaq[]
  tags: string[]
  authorBio: {
    name: string
    avatar: string
    description: string
    location: string
    phone: string
    availability: string
  }
  pingback: {
    title: string
    href: string
  }
  previousPost: { title: string; href: string }
  nextPost: { title: string; href: string }
}

export const blogPostDetail: BlogPostDetail = {
  slug: 'understanding-narrowboat-hull-thickness',
  title: 'Understanding Narrowboat Hull Thickness | The Boat Brokers',
  date: 'August 26, 2026',
  category: 'Blog',
  author: 'Shumail.S',
  commentsCount: 1,
  heroImage,
  toc: [
    { id: 'why-it-matters', label: 'Why hull thickness matters' },
    { id: 'survey-process', label: 'The survey process' },
    { id: 'understanding-readings', label: 'Understanding readings' },
    { id: 'age-vs-condition', label: 'Age vs Condition' },
    { id: 'identifying-problems', label: 'Identifying problems' },
    { id: 'why-knowledge-matters', label: 'Why knowledge matters' },
  ],
  intro: [
    'Of all the checks carried out during a pre-purchase narrowboat survey, hull thickness is arguably the single most critical factor for any buyer to understand.',
  ],
  midCta: {
    heading: 'Need a Second Opinion?',
    description: 'Want an experienced second opinion on a narrowboat survey report?',
    phone: '07960 768724',
    linkLabel: 'theboatbrokers.co.uk/buying',
  },
  sections: [
    {
      id: 'why-it-matters',
      heading: 'Why hull thickness is the foundation of a narrowboat survey',
      paragraphs: [
        "When you commission a hull survey, you're looking for peace of mind. Narrowboats are typically built with steel plates—historically 10mm for the base, 6mm for the hull sides, and 4mm for the cabin. The survey verifies if these thicknesses have held up over time or if corrosion has thinned the steel significantly.",
      ],
    },
    {
      id: 'survey-process',
      heading: 'How a hull survey is actually carried out',
      paragraphs: [
        'A qualified surveyor uses ultrasonic thickness gauges to take dozens, sometimes hundreds, of readings across the hull. This usually involves "spotting" areas where the paint is scraped back to bare metal to get an accurate reading. They look specifically for "pitting"—small craters of corrosion that can go deep into the steel even if the surrounding plate is thick.',
      ],
      image: inlineImage,
    },
    {
      id: 'understanding-readings',
      heading: 'What the readings actually mean for a buyer',
      paragraphs: [
        "If a boat was built with a 10mm base plate and now measures 9.5mm after 20 years, that's excellent. However, if readings show 4mm or 5mm in areas, insurance companies may require \"overplating\"—welding new steel over the old—which is a major expense and can affect the boat's value and handling.",
      ],
    },
    {
      id: 'age-vs-condition',
      heading: 'Age alone does not determine hull condition',
      paragraphs: [
        "We've seen 40-year-old boats with pristine hulls because they were dry-docked regularly and well-maintained with blacking and anodes. Conversely, a 5-year-old boat with poor electrical bonding or neglected maintenance can show worrying signs of galvanic corrosion. Never judge a boat solely by its build year.",
      ],
    },
    {
      id: 'identifying-problems',
      heading: 'What happens if a survey identifies a problem',
      paragraphs: [
        'Don\'t panic. A "bad" survey doesn\'t always mean a bad boat—it means a price negotiation or a repair requirement. Most issues identified in a survey can be rectified, provided the price reflects the work needed. This is where having a professional broker to mediate is invaluable.',
      ],
    },
    {
      id: 'length-and-condition',
      heading: 'Length and hull condition together',
      paragraphs: [
        'The overall length of the boat relative to its hull condition is a major factor in resale value. A 70ft boat with a thin hull is a much larger (and more expensive) repair project than a 30ft boat with similar issues. We analyze these factors holistically when valuing vessels for our clients.',
      ],
    },
    {
      id: 'why-knowledge-matters',
      heading: 'Why hull survey knowledge matters when choosing a broker',
      paragraphs: [
        "At The Boat Brokers, we don't just list boats; we understand the engineering behind them. We can help you interpret survey results accurately, ensuring you're making an informed decision whether you're buying your first narrowboat or selling your long-time home on the water.",
      ],
    },
  ],
  closingCta: {
    heading: 'Considering a Purchase?',
    description:
      'Get the clarity you need before signing. Our experts are here to help you navigate the complexities of narrowboat surveys.',
    phone: '07960 768724',
    linkLabel: 'or visit theboatbrokers.co.uk/buying',
  },
  faqs: [
    {
      question: 'What is a narrowboat hull survey?',
      answer:
        'A hull survey is a professional inspection that measures the thickness of a narrowboat\'s steel plating using ultrasonic gauges, identifying corrosion, pitting and any structural concerns before a sale completes.',
    },
    {
      question: 'What hull readings should concern me?',
      answer:
        'Readings significantly below the original build thickness—typically under 4mm on the base plate—may indicate the boat needs overplating. Your surveyor will flag any readings that fall below a safe margin.',
    },
    {
      question: 'How does age compare to hull condition?',
      answer:
        'Age alone is not a reliable indicator. A well-maintained older boat can have a healthier hull than a neglected newer one, so a current survey always matters more than the build year.',
    },
    {
      question: 'Can I buy a boat with thinning steel?',
      answer:
        'Yes, in many cases. Thinning steel is often reflected in the price or resolved through overplating. A broker can help you negotiate a fair price that accounts for any required work.',
    },
    {
      question: 'Who can help me interpret a survey?',
      answer:
        'A specialist narrowboat broker who understands survey reports can help translate the technical findings into practical next steps for your purchase or sale.',
    },
    {
      question: 'How often should a hull be surveyed?',
      answer:
        'Most insurers require a hull survey every five years, though boats with a history of corrosion or heavy use may benefit from more frequent checks.',
    },
  ],
  tags: ['narrowboat hull survey', 'boat buying tips', 'maintenance guide', 'uk canals'],
  authorBio: {
    name: 'The Boat Brokers',
    avatar: authorAvatar,
    description:
      'Based in Worcestershire, West Midlands, we are dedicated narrowboat specialists committed to transparent and professional brokerage services across the UK network.',
    location: 'Worcestershire',
    phone: '07960 768724',
    availability: 'Open 7 Days',
  },
  pingback: {
    title: 'Understanding Narrowboat Hull Thickness | The Boat Brokers - Best Boats For Living',
    href: '#',
  },
  previousPost: { title: 'Best Narrowboat Lengths for Different Lifestyles', href: '/blog' },
  nextPost: { title: 'Are Boat Brokerage Fees Worth Paying?', href: '/blog' },
}
