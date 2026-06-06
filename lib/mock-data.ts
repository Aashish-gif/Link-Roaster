import { Roast } from './types'

export const mockRoasts: Roast[] = [
  {
    id: '1',
    url: 'https://www.example-crypto-startup.com',
    favicon: 'https://www.google.com/s2/favicons?sz=64&domain=example.com',
    summary: 'A blockchain-based solution for managing digital assets with promises of revolutionary technology.',
    roast: 'Another crypto project with a whitepaper nobody reads and promises of "decentralized" everything. The site screams "we got VC funding" with its stock photos and corporate jargon. "Revolutionary" and "blockchain" appear 47 times on the homepage. The "team" section features photos so high-res they look AI-generated. Absolutely no actual product demo. Just vibes.',
    verdict: 'Thinks it\'s changing the world. It\'s changing nothing.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: '2',
    url: 'https://www.buzzword-saas-tool.io',
    favicon: 'https://www.google.com/s2/favicons?sz=64&domain=saas.com',
    summary: 'A productivity SaaS platform that claims to revolutionize team collaboration with AI integration.',
    roast: 'This is what happens when you put a thesaurus and an AI in a room together. "Synergistic engagement metrics," "AI-powered intelligence," "deep integration capabilities" — the buzzword density here could power a small city. The pricing page conveniently hides the actual price until you give them your email. The "AI features" are literally just autocomplete. Features list includes things that are already in Slack and Notion, but somehow they cost $299/month.',
    verdict: 'It\'s Slack meets Notion meets someone\'s fever dream.',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: '3',
    url: 'https://www.startup-that-raised-500k.com',
    favicon: 'https://www.google.com/s2/favicons?sz=64&domain=startup.com',
    summary: 'A platform solving a problem nobody asked for with a team of first-time founders.',
    roast: 'Funding raised: $500k. Time spent on homepage: 20 minutes. Spelling errors on the "About" page: 3. The homepage video autoplays with music that sounds like a stock audio library had a stroke. The testimonials are suspiciously vague ("This changed my life!") and the photos look like stock images of stock image models. The roadmap shows features from 2023 as "coming soon." Everyone on the team is a "founder" or "co-founder."',
    verdict: 'Funded more than it\'s thought through.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: '4',
    url: 'https://www.personal-brand-portfolio.com',
    favicon: 'https://www.google.com/s2/favicons?sz=64&domain=portfolio.com',
    summary: 'A personal brand portfolio website with excessive animations and self-promotion.',
    roast: 'Loading time: 47 seconds. Number of unnecessary animations: 89. Times the word "passionate" appears: 12. This is what happens when someone discovers parallax scrolling and thinks "yeah, all of that." The homepage loads with a spinning 3D cube of their face while lo-fi beats play. The portfolio section has projects from 2015 listed as recent work. There\'s a "Let\'s grab coffee" CTA button that doesn\'t actually lead anywhere. The blog has one post from 2019 titled "My thoughts on the future of tech."',
    verdict: 'More effort on animations than actual work.',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    url: 'https://www.enterprise-solution-megacorp.com',
    favicon: 'https://www.google.com/s2/favicons?sz=64&domain=enterprise.com',
    summary: 'A massive enterprise software platform promising to be the all-in-one solution for businesses.',
    roast: 'Words on homepage: 4,847. Actual product information: none. The site requires you to "Schedule a demo" to see anything. Stock photos of people laughing at salads. The copy is so generic it could apply to literally any business software. "Transform your business," "Unlock your potential," "Maximize your ROI." Every feature is described in terms so vague they mean nothing. The security section just says "Enterprise-grade security" with no actual details. Waiting for the sales call is probably how you actually learn what it does.',
    verdict: 'Selling mystery in an enterprise-sized bottle.',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: '6',
    url: 'https://www.fitness-app-clone.app',
    favicon: 'https://www.google.com/s2/favicons?sz=64&domain=fitness.app',
    summary: 'Yet another fitness tracking app with the same features as 10,000 competitors.',
    roast: 'Icon count: 127. Original ideas: 0. This is what fitness apps looked like in 2014. Bright neon colors everywhere. The "revolutionary" feature is tracking water intake with a little bottle animation. The motivational quotes on the loading screens are the same ones in every other fitness app. Community features? Just check-in photos of protein shakes. The workout plans are generic 3-sets-of-10 templates. The "AI coach" is literally just a chatbot with pre-written responses. $14.99/month to be told what you already know.',
    verdict: 'If crypto and fitness apps had a baby.',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
  {
    id: '7',
    url: 'https://www.newsletter-for-newsletters.substack.com',
    favicon: 'https://www.google.com/s2/favicons?sz=64&domain=substack.com',
    summary: 'A newsletter about newsletters about the future of content creation.',
    roast: 'This is meta to the point of singularity. A newsletter about newsletters. Every issue is 5,000 words about "the state of newsletters." The author claims to be "reshaping how people consume information" by... sending emails. The sponsorships are for other newsletters. The comments are other newsletter writers self-promoting. There\'s a 12-part series on "How I grew my newsletter" that took 6 months to publish. The content is 40% introduction, 40% fluff, 20% actual substance, and 100% trying too hard.',
    verdict: 'Inception but for content marketing.',
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000),
  },
  {
    id: '8',
    url: 'https://www.design-agency-portfolio.studio',
    favicon: 'https://www.google.com/s2/favicons?sz=64&domain=studio.com',
    summary: 'A design agency showcasing their "award-winning" work and premium services.',
    roast: 'Everything is either animated to death or uses a monospace font for no reason. The work shown is... fine. Not award-winning, definitely not worth the $15k project minimum they mention in vague testimonials. Every case study uses the word "elegant" and "refined." The team photos are so moody and well-lit you\'d think they\'re selling mystery, not design. Process description takes up 40% of the site. Awards mentioned: all given by design agencies themselves. The contact form? Only for "serious inquiries" (aka people with big budgets they want to intimidate into silence).',
    verdict: 'Style over substance wrapped in mystery.',
    createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000),
  },
]

export function getMockRoastById(id: string): Roast | undefined {
  return mockRoasts.find((roast) => roast.id === id)
}

export function generateMockRoast(url: string): Promise<Roast> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const roasts = [
        'This website exists. That\'s about all we can say for it.',
        'If mediocrity had a homepage, this would be it.',
        'The internet was a mistake, but this website proved it.',
        'It\'s giving "I built this on Wix in 2015 and never updated it."',
        'The design is so minimalist, even the content is sparse.',
      ]

      const verdicts = [
        'Does what it says it does. Barely.',
        'Better than nothing. Slightly.',
        'You\'ve seen this 1,000 times.',
        'Exists. We\'re not sure why.',
        'There\'s a lot of potential here. Wasted.',
      ]

      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)]
      const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)]

      resolve({
        id: Date.now().toString(),
        url,
        favicon: `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname}`,
        summary: `A website about ${new URL(url).hostname.replace('www.', '')}. It has pages, content, and potentially a purpose.`,
        roast: randomRoast,
        verdict: randomVerdict,
        createdAt: new Date(),
      })
    }, 1500)
  })
}
