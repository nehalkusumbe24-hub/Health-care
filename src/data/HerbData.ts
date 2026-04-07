export interface Herb {
  id: string;
  name: string;
  sanskrit: string;
  benefit: string;
  dosha: string[];
  use: string;
  image?: string;
}

export const HERBS: Herb[] = [
  {
    id: 'herb-ashwagandha',
    name: 'Ashwagandha',
    sanskrit: 'Withania somnifera',
    benefit: 'Strength, stamina, and stress resilience.',
    dosha: ['Vata', 'Kapha'],
    use: 'Best taken with warm milk at night for sleep and strength.'
  },
  {
    id: 'herb-triphala',
    name: 'Triphala',
    sanskrit: 'Three Fruits',
    benefit: 'Digestion, colon cleansing, and rejuvenation.',
    dosha: ['Vata', 'Pitta', 'Kapha'],
    use: '1 tsp with warm water before bed for internal cleansing.'
  },
  {
    id: 'herb-brahmi',
    name: 'Brahmi',
    sanskrit: 'Bacopa monnieri',
    benefit: 'Memory, concentration, and mental peace.',
    dosha: ['Pitta', 'Vata'],
    use: 'Ideal for students and professionals seeking focus.'
  },
  {
    id: 'herb-tulsi',
    name: 'Tulsi',
    sanskrit: 'Holy Basil',
    benefit: 'Immunity, respiratory health, and spirit.',
    dosha: ['Kapha', 'Vata'],
    use: 'Brewed as tea with ginger for cold and cough.'
  },
  {
    id: 'herb-amla',
    name: 'Amla',
    sanskrit: 'Amalaki',
    benefit: 'Vitamin C, hair health, and anti-aging.',
    dosha: ['Pitta', 'Vata', 'Kapha'],
    use: 'The highest natural source of Vitamin C. Great for skin.'
  },
  {
    id: 'herb-shatavari',
    name: 'Shatavari',
    sanskrit: 'Asparagus racemosus',
    benefit: 'Hormonal balance and feminine health.',
    dosha: ['Pitta', 'Vata'],
    use: 'Supports fertility, lactation, and cooling the body.'
  },
  {
    id: 'herb-guduchi',
    name: 'Guduchi',
    sanskrit: 'Tinospora cordifolia',
    benefit: 'Immunity and fever management.',
    dosha: ['Vata', 'Pitta', 'Kapha'],
    use: 'The ultimate immune booster and blood purifier.'
  },
  {
    id: 'herb-shallaki',
    name: 'Shallaki',
    sanskrit: 'Boswellia serrata',
    benefit: 'Joint pain and inflammation relief.',
    dosha: ['Vata', 'Kapha'],
    use: 'Essential for arthritis and physical mobility.'
  },
  {
    id: 'herb-ginger',
    name: 'Ginger',
    sanskrit: 'Shunti / Adrak',
    benefit: 'Universal medicine for digestion and cold.',
    dosha: ['Vata', 'Kapha'],
    use: 'Fresh ginger for digestion, dry ginger for respiratory issues.'
  },
  {
    id: 'herb-turmeric',
    name: 'Turmeric',
    sanskrit: 'Haridra / Haldi',
    benefit: 'Anti-inflammatory and blood purifier.',
    dosha: ['Pitta', 'Vata', 'Kapha'],
    use: 'Include in cooking daily or drink as Golden Milk.'
  },
  {
    id: 'herb-neem',
    name: 'Neem',
    sanskrit: 'Azadirachta indica',
    benefit: 'Detoxification and skin health.',
    dosha: ['Pitta', 'Kapha'],
    use: 'The ultimate blood purifier, great for acne and hair.'
  },
  {
    id: 'herb-moringa',
    name: 'Moringa',
    sanskrit: 'Shigru',
    benefit: 'Nutrition, energy, and joint health.',
    dosha: ['Kapha', 'Vata'],
    use: 'Highly nutritious for energy and vision.'
  },
  {
    id: 'herb-shankhpushpi',
    name: 'Shankhpushpi',
    sanskrit: 'Convolvulus pluricaulis',
    benefit: 'Intellect, memory, and anxiety relief.',
    dosha: ['Vata', 'Pitta'],
    use: 'Take for mental clarity and nervous system support.'
  },
  {
    id: 'herb-manjistha',
    name: 'Manjistha',
    sanskrit: 'Rubia cordifolia',
    benefit: 'Lymphatic drainage and blood health.',
    dosha: ['Pitta', 'Kapha'],
    use: 'Clears skin and purifies the blood lymphatic system.'
  },
  {
    id: 'herb-cardamom',
    name: 'Cardamom',
    sanskrit: 'Elaichi',
    benefit: 'Digestion and breath freshness.',
    dosha: ['Vata', 'Pitta', 'Kapha'],
    use: 'Chew seeds after meals or add to tea/desserts.'
  }
];
