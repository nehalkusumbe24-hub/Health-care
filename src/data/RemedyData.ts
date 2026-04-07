export interface Remedy {
  id: string;
  problem: string;
  description: string;
  dosha_effect: string;
  herb: {
    name: string;
    dosage: string;
    benefit: string;
  };
  diet: {
    favor: string[];
    avoid: string[];
  };
  yoga: string[];
  lifestyle: string;
  assignments: string[]; 
}

export const REMEDIES: Remedy[] = [
  {
    id: 'rem-anxiety',
    problem: 'Anxiety & Overthinking',
    description: 'A classic Vata imbalance marked by irregular energy and mental "wind".',
    dosha_effect: 'Vata Balancing',
    herb: {
      name: 'Ashwagandha',
      dosage: '500mg with warm milk at bedtime',
      benefit: 'Reduces cortisol and grounds the nervous system.'
    },
    diet: {
      favor: ['Warm soups', 'Ghee', 'Root vegetables', 'Sweet fruits'],
      avoid: ['Caffeine', 'Cold salads', 'Dry crackers', 'Ice water']
    },
    yoga: ['Balasana (Child Pose)', 'Vrikshasana (Tree Pose)', 'Nadi Shodhana Pranayama'],
    lifestyle: 'Maintain a strict daily routine (Dinacharya) and practice daily self-massage (Abhyanga).',
    assignments: [
      'Daily 10 min Nadi Shodhana at dawn',
      'Warm sesame oil foot massage before bed',
      'Eat lunch at exactly 1:00 PM every day'
    ]
  },
  {
    id: 'rem-indigestion',
    problem: 'Indigestion & Bloating',
    description: 'Weak digestive fire (Agni) leading to toxin (Ama) accumulation.',
    dosha_effect: 'Agni Igniting',
    herb: {
      name: 'Triphala',
      dosage: '1 tsp with warm water before bed',
      benefit: 'Cleanses the colon and regulates digestion.'
    },
    diet: {
      favor: ['Ginger tea', 'Kitchari', 'Steamed vegetables', 'Cumin'],
      avoid: ['Heavy meat', 'Fried foods', 'Cheese', 'Overeating']
    },
    yoga: ['Pavanamuktasana', 'Paschimottanasana', 'Vajrasana after meals'],
    lifestyle: 'Avoid drinking water 30 mins before/after meals. Chew food 32 times.',
    assignments: [
      'Sip warm ginger water throughout the day',
      'Vajrasana pose for 5 mins after dinner',
      'No cold drinks with meals'
    ]
  },
  {
    id: 'rem-cold',
    problem: 'Common Cold & Cough',
    description: 'Excess Kapha and Vata in the respiratory tract.',
    dosha_effect: 'Kapha-Vata Balancing',
    herb: {
      name: 'Tulsi & Ginger',
      dosage: 'Tea made with 5-7 leaves and 1 inch ginger',
      benefit: 'Natural expectorant and immune booster.'
    },
    diet: {
      favor: ['Honey', 'Black pepper', 'Hot water', 'Light porridges'],
      avoid: ['Curd (Yogurt)', 'Cold milk', 'Sweets', 'Banana']
    },
    yoga: ['Surya Namaskar', 'Bhastrika Pranayama', 'Ustrasana'],
    lifestyle: 'Keep the chest and neck warm. Gargle with warm salt water.',
    assignments: [
      'Drink Tulsi-Ginger tea twice daily',
      'Warm salt water gargle before bed',
      'Steam inhalation for 5 mins'
    ]
  },
  {
    id: 'rem-acne',
    problem: 'Acne & Skin Inflammation',
    description: 'Excess Pitta (heat) and toxins in the blood (Raktha dhatu).',
    dosha_effect: 'Pitta Cooling',
    herb: {
      name: 'Neem & Manjistha',
      dosage: '1 capsule of each after breakfast',
      benefit: 'Purifies the blood and reduces skin heat.'
    },
    diet: {
      favor: ['Aloe vera juice', 'Cucumber', 'Cilantro', 'Bitter greens'],
      avoid: ['Deep fried food', 'Spicy chili', 'Fermented food', 'Junk food']
    },
    yoga: ['Sitali Pranayama', 'Sarvangasana', 'Sheetkari'],
    lifestyle: 'Use cooling facial sprays like Rose Water. Avoid excessive sun exposure.',
    assignments: [
      'Drink fresh Aloe vera juice in morning',
      'Apply sandalwood paste to active acne',
      '10 mins of Sitali cooling breath'
    ]
  },
  {
    id: 'rem-stress',
    problem: 'Chronic Stress & Burnout',
    description: 'Depleted Ojas (vital energy) due to constant high-intensity living.',
    dosha_effect: 'Ojas Rejuvenating',
    herb: {
      name: 'Shankhpushpi',
      dosage: '1 tsp powder with warm milk or water',
      benefit: 'Nervine tonic that restores mental energy and calm.'
    },
    diet: {
      favor: ['Soaked almonds', 'Dates', 'Saffron milk', 'Whole grains'],
      avoid: ['Excessive salt', 'Refined sugar', 'Alcohol', 'Stimulants']
    },
    yoga: ['Viparita Karani', 'Yoga Nidra', 'Anulom Vilom'],
    lifestyle: 'Prioritize 8 hours of sleep. Spend at least 20 mins in nature.',
    assignments: [
      'Practice 15 min Yoga Nidra before sleep',
      'Eat 5 soaked almonds every morning',
      '20 mins nature walk at sunset'
    ]
  },
  {
    id: 'rem-immunity',
    problem: 'Low Immunity (Immune Support)',
    description: 'Weak Ojas making the body susceptible to frequent infections.',
    dosha_effect: 'Immunity Boosting',
    herb: {
      name: 'Guduchi (Giloy)',
      dosage: '1/2 tsp twice daily with honey',
      benefit: 'Powerful immunomodulator and blood purifier.'
    },
    diet: {
      favor: ['Fresh seasonal fruit', 'Amla', 'Turmeric milk', 'Garlic'],
      avoid: ['Leftover food', 'Stale food', 'Processed snacks']
    },
    yoga: ['Suryanamaskar', 'Matsyasana', 'Kapalabhati'],
    lifestyle: 'Maintain regular bowel movements. Avoid suppression of natural urges.',
    assignments: [
      'Take 1 tsp Chavanprash daily',
      'Add turmeric to all cooked meals',
      '12 rounds of Sun Salutations daily'
    ]
  },
  {
    id: 'rem-migraine',
    problem: 'Migraine & Chronic Headaches',
    description: 'Pitta-Vata aggravation in the head and nervous system.',
    dosha_effect: 'Pitta-Vata Balancing',
    herb: {
      name: 'Brahmi & Nutmeg',
      dosage: '1 capsule of Brahmi, nutmeg milk at night',
      benefit: 'Cools the nerves and relaxes the mind.'
    },
    diet: {
      favor: ['Sweet fruits', 'Ghee', 'Cilantro', 'Coconut water'],
      avoid: ['Aged cheese', 'Caffeine', 'Chocolate', 'Excessive salt']
    },
    yoga: ['Savasana', 'Balasana', 'Alternate Nostril Breathing'],
    lifestyle: 'Avoid direct bright sunlight. Limit screen time. Apply Brahmi oil to temples.',
    assignments: [
      'Apply cool water to forehead during aura',
      'Drink coconut water at 11:00 AM',
      '10 min daily Savasana in a dark room'
    ]
  },
  {
    id: 'rem-hairfall',
    problem: 'Hair Fall & Thinning',
    description: 'Excess Pitta at the hair roots or weak nutrition (Asthi dhatu).',
    dosha_effect: 'Pitta Cooling & Nourishing',
    herb: {
      name: 'Bhringraj & Amla',
      dosage: '1 tsp Bhringraj powder with water',
      benefit: 'The "King of Hair" — restores vitality and color.'
    },
    diet: {
      favor: ['Sesame seeds', 'Iron-rich greens', 'Amla', 'Pumpkin seeds'],
      avoid: ['Spicy food', 'Sour pickles', 'Excessive vinegar', 'Alcohol']
    },
    yoga: ['Adho Mukha Svanasana', 'Sirsasana (if qualified)', 'Vajrasana'],
    lifestyle: 'Daily scalp massage with Bhringraj oil. Avoid chemical shampoos.',
    assignments: [
      'Scalp massage with Bhringraj oil for 10 mins',
      'Eat 1 tbsp black sesame seeds daily',
      'Use natural Hibiscus hair wash today'
    ]
  },
  {
    id: 'rem-menstrual',
    problem: 'Menstrual Cramps & Imbalance',
    description: 'Apanavata (downward energy) obstruction causing pain and irregular cycles.',
    dosha_effect: 'Vata-Pitta Balancing',
    herb: {
      name: 'Shatavari & Aloe Vera',
      dosage: '1/2 tsp Shatavari with warm water',
      benefit: 'Balances hormones and nourishes the reproductive system.'
    },
    diet: {
      favor: ['Warm tea', 'Papaya', 'Fennel seeds', 'Soaked walnuts'],
      avoid: ['Cold water', 'Dry food', 'Raw salads', 'Caffeine']
    },
    yoga: ['Baddha Konasana', 'Supta Baddha Konasana', 'Pranayama'],
    lifestyle: 'Prioritize rest. Apply local heat using a warm water bottle.',
    assignments: [
      'Drink fennel tea twice daily',
      'Practice 15 mins of gentle Baddha Konasana',
      'Limit strenuous exercise today'
    ]
  },
  {
    id: 'rem-backpain',
    problem: 'Back Pain & Muscle Stiffness',
    description: 'High Vata and Ama (toxins) settling in the bone and muscle joints.',
    dosha_effect: 'Vata Relieving',
    herb: {
      name: 'Guggul & Ashwagandha',
      dosage: '1 tablet Guggul twice daily',
      benefit: 'Reduces inflammation and eliminates joint toxins.'
    },
    diet: {
      favor: ['Cooked warm grains', 'Sesame oil', 'Garlic', 'Steamed greens'],
      avoid: ['Raw sprouts', 'Cold sandwiches', 'Processed sugar']
    },
    yoga: ['Marjariasana (Cat-Cow)', 'Tadasana', 'Bhujangasana'],
    lifestyle: 'Abhyanga (warm oil massage) followed by a steam bath. Maintain good posture.',
    assignments: [
      'Apply warm sesame oil to back for 15 mins',
      'Followed by hot compress or warm bath',
      '5 rounds of gentle Cat-Cow stretch'
    ]
  }
];
