
export type Mantra = {
  id: number;
  name: string;
  name_en: string;
  url: string;
  assetId?: string;
  description?: string;
  description_en?: string;
  method?: string;
  method_en?: string;
  benefits?: string;
  benefits_en?: string;
  tier: "free" | "paid";
  category: "protective" | "solving";
};

export const mantras: Mantra[] = [
  {
    id: 1,
    name: 'ಶಾರೀರಿಕ ಆರಾಮಕ್ಕೆ ಶಕ್ತಿಶಾಲಿ ಕಾಳಿ ಮಂತ್ರ',
    name_en: 'Powerful Kali Mantra for Physical Comfort',
    url: '/kali-mantra.mp3',
    method: 'ಒಂದು ಲೋಟ ಶುದ್ಧ ಕುಡಿಯುವ ನೀರನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ. ಲೌಡ್ ಸ್ಪೀಕರ್ ಆನ್ ಮಾಡಿ ಮಂತ್ರವನ್ನು ಪ್ಲೇ ಮಾಡಿ. ಆ ನೀರನ್ನು ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಕುಡಿಯಿರಿ.',
    method_en: 'Take a glass of clean drinking water. Play the mantra near the water with loudspeaker on. Drink the water twice a day.',
    benefits: 'ದೇಹ ಮತ್ತು ಕೀಲುಗಳ ಸೌಖ್ಯಕ್ಕೆ ಆಧ್ಯಾತ್ಮಿಕ ಬೆಂಬಲ. ದೈಹಿಕ ಶಕ್ತಿ ಹೆಚ್ಚಳ.',
    benefits_en: 'Spiritual support for body and joint comfort. Increased physical vitality.',
    description: 'ಈ ಕಾಳಿ ಮಂತ್ರವು ದೈಹಿಕ ಅಡೆತಡೆಗಳನ್ನು ನಿವಾರಿಸಲು ಮತ್ತು ಚೈತನ್ಯ ತುಂಬಲು ಶಕ್ತಿಯುತವಾಗಿದೆ. ಶ್ರದ್ಧೆಯಿಂದ ಅಭ್ಯಾಸ ಮಾಡಿ.',
    description_en: 'This Kali mantra is powerful for removing physical obstacles and infusing vitality. Practice with devotion.',
    tier: "paid", // Changed to paid to ensure ads trigger for testing
    category: "solving",
  },
  {
    id: 2,
    name: 'ಕಣ್ಣಿನ ಸ್ವಾಸ್ಥ್ಯಕ್ಕಾಗಿ ಶಕ್ತಿಶಾಲಿ ಚಾಕ್ಷುಷ ಮಂತ್ರ',
    name_en: 'Powerful Chakshu Mantra for Eye Wellness',
    url: '/chakshu-mantra.mp3',
    method: 'ಹೆಡ್‌ಫೋನ್ ಅಥವಾ ಇಯರ್‌ಫೋನ್ ಬಳಸಿ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಮಂತ್ರವನ್ನು ಕೇಳಿ.',
    method_en: 'Listen to the mantra twice a day using headphones or earphones.',
    benefits: 'ಕಣ್ಣಿನ ಆರೋಗ್ಯ ಸುಧಾರಣೆ ಮತ್ತು ದೃಷ್ಟಿ ದೋಷಗಳ ನಿವಾರಣೆಗೆ ಬೆಂಬಲ.',
    benefits_en: 'Supports eye health improvement and removal of vision obstacles.',
    description: 'ಪ್ರಾಚೀನ ನೇತ್ರ ಜ್ಯೋತಿ ಮಂತ್ರವು ಕಣ್ಣಿನ ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡಲು ಮತ್ತು ದೃಷ್ಟಿ ಸಮತೋಲನಕ್ಕೆ ಪ್ರಸಿದ್ಧವಾಗಿದೆ.',
    description_en: 'An ancient mantra famous for protecting eye health and balancing vision.',
    tier: "paid",
    category: "solving",
  },
  {
    id: 3,
    name: 'ಸ್ವಾಸ್ಥ್ಯ ಮಂಗಳ ಸ್ತೋತ್ರ',
    name_en: 'Mangala Stotra for General Wellness',
    url: 'https://firebasestorage.googleapis.com/v0/b/studio-9442084622-48e5f.firebasestorage.app/o/assets%2Fmangala-stotra-mp3?alt=media&token=54700d3d-9fbe-4682-965d-db9675276536',
    assetId: 'mangala-stotra-mp3',
    method: 'ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಶ್ರದ್ಧೆಯಿಂದ ಕೇಳಿ. ಮನೆಯಲ್ಲಿ ಪ್ಲೇ ಮಾಡುವುದರಿಂದ ಸಕಾರಾತ್ಮಕ ಶಕ್ತಿ ಹೆಚ್ಚುತ್ತದೆ.',
    method_en: 'Listen with devotion twice a day. Playing it at home increases positive energy and harmonic vibrations.',
    benefits: 'ದೀರ್ಘಕಾಲದ ಸ್ವಾಸ್ಥ್ಯ ಮತ್ತು ಶಾರೀರಿಕ ದೌರ್ಬಲ್ಯ ನಿವಾರಣೆಗೆ ಬೆಂಬಲ.',
    benefits_en: 'Supports long-term wellness and removal of physical weakness.',
    description: 'ಈ ಸ್ತೋತ್ರವು ಅಡೆತಡೆಗಳನ್ನು ನಿವಾರಿಸಲು ಮತ್ತು ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡಲು ಅತ್ಯಂತ ಮಂಗಳಕರವಾಗಿದೆ.',
    description_en: 'This stotra is highly auspicious for warding off obstacles and maintaining robust wellness.',
    tier: "paid",
    category: "solving",
  },
  { 
    id: 9, 
    name: 'ಸರ್ವ ಸ್ವಾಸ್ಥ್ಯ ಪ್ರದಾಯಕ ಆಂಜನೇಯ ಮಂತ್ರ', 
    name_en: 'Anjaneya Mantra for Overall Wellness',
    url: '/anjaneya-mantra.mp3',
    method: 'ಈ ಮಂತ್ರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಮತ್ತು ಸರಿಯಾದ ವಿಧಾನಕ್ಕೆ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    method_en: 'Contact the center to activate this mantra and learn the specific procedure.',
    benefits: 'ದೀರ್ಘಕಾಲದ ಅಸ್ವಸ್ಥತೆಗಳಿಂದ ಮುಕ್ತಿ ಮತ್ತು ದೈಹಿಕ ಸಮತೋಲನ.',
    benefits_en: 'Freedom from long-standing discomfort and physical balancing.',
    description: 'ಪ್ರಾಣ ದೇವರಾದ ಹನುಮಂತನ ಈ ಮಂತ್ರವು ಜೀವನಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸಲು ಫಲಕಾರಿ. ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆ ಅಗತ್ಯ.',
    description_en: 'This mantra of Lord Hanuman is effective in increasing life force energy. Requires personalized activation.',
    tier: "paid",
    category: "solving"
  },
  { 
    id: 17, 
    name: 'ಸರ್ವ ಭಯ ಮತ್ತು ಸಂಕಷ್ಟ ನಿವಾರಣಾ ಭೈರವ ಮಂತ್ರ', 
    name_en: 'Bhairava Mantra for Removal of All Fear & Troubles',
    url: 'https://firebasestorage.googleapis.com/v0/b/studio-9442084622-48e5f.firebasestorage.app/o/assets%2Fbhairava-avesha-mamtra-mp3?alt=media&token=e9e6b4f7-872c-473d-88f5-654877777777',
    assetId: 'bhairava-avesha-mamtra-mp3',
    method: 'ಹೆಡ್‌ಫೋನ್ ಅಥವಾ ಇಯರ್‌ಫೋನ್ ಬಳಸಿ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಮಂತ್ರವನ್ನು ಕೇಳಿ.',
    method_en: 'Listen to the mantra twice a day using headphones or earphones.',
    benefits: 'ಎಲ್ಲಾ ರೀತಿಯ ಭಯ, ಆತಂಕ ಮತ್ತು ಜೀವನದ ಸಂಕಷ್ಟಗಳ ನಿವಾರಣೆ. ಮಾನಸಿಕ ಸ್ಥೈರ್ಯ.',
    benefits_en: 'Removal of all types of fear, anxiety, and life\'s obstacles. Mental strength.',
    description: 'ಭೈರವ ಮಂತ್ರವು ರಕ್ಷಣೆ ಮತ್ತು ಧೈರ್ಯವನ್ನು ನೀಡುವ ಅತ್ಯಂತ ಪ್ರಭಾವಶಾಲಿ ಮಂತ್ರವಾಗಿದೆ.',
    description_en: 'Bhairava mantra is a highly influential mantra for protection and courage.',
    tier: "paid",
    category: "protective"
  },
  { 
    id: 11, 
    name: 'ಶತ್ರು ಮತ್ತು ಹಿತಶತ್ರು ನಿವಾರಣಾ ಬಗಲಾಮುಖಿ ಮಂತ್ರ', 
    name_en: 'Bagalamukhi Mantra for Enemy & Hidden Enemy Removal',
    url: '/bagalamukhi-mantra.mp3',
    method: 'ಈ ಮಂತ್ರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಮತ್ತು ಸರಿಯಾದ ವಿಧಾನಕ್ಕೆ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    method_en: 'Contact the center to activate this mantra and for the correct procedure.',
    benefits: 'ಶತ್ರುಗಳ ಸಂಚು ಮತ್ತು ಹಿತಶತ್ರುಗಳ ಪೀಡೆಯಿಂದ ಸಂಪೂರ್ಣ ಮುಕ್ತಿ.',
    benefits_en: 'Complete freedom from enemy conspiracies and hidden adversaries.',
    description: 'ಬಗಲಾಮುಖಿ ಮಂತ್ರವು ಸ್ತಂಭನ ಶಕ್ತಿಯನ್ನು ಹೊಂದಿದ್ದು, ವಿರೋಧಿಗಳನ್ನು ಶಾಂತಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    description_en: 'Bagalamukhi mantra possesses stalling power and helps in silencing opponents.',
    tier: "paid",
    category: "solving"
  },
  { 
    id: 10, 
    name: 'ಮಾನಸಿಕ ಸೌಖ್ಯ ಪ್ರದಾಯಕ ಹಂಸ ಮಂತ್ರ', 
    name_en: 'Hamsa Mantra for Mental Wellness and Peace',
    url: '/hamsa-mantra.mp3', 
    method: 'ಈ ಮಂತ್ರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಮತ್ತು ಸರಿಯಾದ ವಿಧಾನಕ್ಕೆ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    method_en: 'Contact the center to activate this mantra and for the procedure.',
    benefits: 'ಮಾನಸಿಕ ಅಡೆತಡೆಗಳಿಂದ ಮುಕ್ತಿ. ಮನಸ್ಸಿಗೆ ಶಾಂತಿ ಮತ್ತು ಪ್ರಶಾಂತತೆ.',
    benefits_en: 'Freedom from mental obstacles. Peace and tranquility for the mind.',
    description: 'ಹಂಸ ಮಂತ್ರವು ಉಸಿರಾಟದ ಜೊತೆಗೂಡಿ ಮನಸ್ಸನ್ನು ಶುದ್ಧೀಕರಿಸುವ ಸಕ್ರಿಯ ಮಂತ್ರವಾಗಿದೆ.',
    description_en: 'The Hamsa mantra is an active mantra that purifies the mind in sync with breathing.',
    tier: "paid",
    category: "solving"
  },
  { 
    id: 16, 
    name: 'ಸಾಲ, ಋಣ ನಿವಾರಣೆಯ ಶುಕ್ರಾಚಾರ್ಯ ಮಂತ್ರ',
    name_en: 'Shukracharya Mantra for Debt Removal',
    url: '/shukracharya-mantra.mp3', 
    assetId: 'shukracharya-mantra-mp3',
    method: 'ಹೆಡ್‌ಫೋನ್ ಬಳಸಿ ಶ್ರದ್ಧೆಯಿಂದ ಪ್ರತಿದಿನ ಕೇಳಿ.',
    method_en: 'Listen daily with devotion using headphones.',
    benefits: 'ಸಾಲದ ಬಾಧೆಗಳಿಂದ ಮುಕ್ತಿ ಮತ್ತು ಆರ್ಥಿಕ ಸ್ಥಿರತೆ.',
    benefits_en: 'Freedom from debt burdens and financial stability.',
    description: 'ಶುಕ್ರಾಚಾರ್ಯ ಮಂತ್ರವು ಸಾಲದ समस्याಗಳಿಂದ ಮುಕ್ತಿ ಪಡೆಯಲು ಅತ್ಯಂತ ಫಲಪ್ರದವಾಗಿದೆ.',
    description_en: 'Shukracharya mantra is highly effective for overcoming debt-related issues.',
    tier: "paid",
    category: "solving"
  },
  { 
    id: 15, 
    name: 'ಮಹಾ ಆಕರ್ಷಣ ಮಂತ್ರ', 
    name_en: 'Maha Akarshana (Great Attraction) Mantra',
    url: '/maha-akarshana-mantra.mp3', 
    method: 'ದಿನದ ಆರಂಭದಲ್ಲಿ ಶ್ರದ್ಧೆಯಿಂದ ಕೇಳಿ.',
    method_en: 'Listen with devotion at the beginning of the day.',
    benefits: 'ಸಮಾಜದಲ್ಲಿ ಗೌರವ, ವ್ಯಕ್ತಿತ್ವದ ವಿಕಸನ ಮತ್ತು ಆಕರ್ಷಣ ಶಕ್ತಿ ಹೆಚ್ಚಳ.',
    benefits_en: 'Increased respect in society, personality development, and attraction power.',
    tier: "paid",
    category: "protective"
  },
  { 
    id: 12, 
    name: 'ಐಶ್ವರ್ಯ ಮತ್ತು ಸಂಪತ್ತಿಗಾಗಿ ಕುಭೇರ ಮಂತ್ರ', 
    name_en: 'Kubera Mantra for Wealth and Prosperity',
    url: '/kubera-mantra.mp3', 
    method: 'ಮನೆಯ ದೇವರ ಕೋಣೆಯಲ್ಲಿ ಅಥವಾ ವ್ಯಾಪಾರ ಸ್ಥಳದಲ್ಲಿ ಪ್ಲೇ ಮಾಡಿ.',
    method_en: 'Play in your home altar or place of business.',
    benefits: 'ಐಶ್ವರ್ಯ, ಸಂಪತ್ತಿನ ವೃದ್ಧಿ ಮತ್ತು ಆರ್ಥಿಕ ಅಭಿವೃದ್ಧಿ.',
    benefits_en: 'Increase in wealth, prosperity, and economic growth.',
    tier: "paid",
    category: "protective"
  },
  { 
    id: 13, 
    name: 'ಹಣಕಾಸಿನ ಹರಿವಿನ ತೊಡಕಿನ ನಿವಾರಣೆಗೆ ಮಹಾಲಕ್ಷ್ಮಿ ಮಂತ್ರ', 
    name_en: 'Mahalakshmi Mantra for Overcoming Financial Obstacles',
    url: '/mahalakshmi-mantra.mp3', 
    method: 'ಹೆಡ್‌ಫೋನ್ ಬಳಸಿ ಅಥವಾ ಸೌಂಡ್ ಸಿಸ್ಟಮ್‌ನಲ್ಲಿ ಕೇಳಿ.',
    method_en: 'Listen using headphones or on a sound system.',
    benefits: 'ಹಣಕಾಸಿನ ಹರಿವಿನ ಅಡೆತಡೆಗಳ ನಿವಾರಣೆ ಮತ್ತು ಸಕಲ ಭಾಗ್ಯಗಳು.',
    benefits_en: 'Removal of financial flow obstacles and attainment of all fortunes.',
    tier: "paid",
    category: "protective"
  },
  { 
    id: 14, 
    name: 'ವಿದ್ಯಾ ಬುದ್ದಿಗಾಗಿ ಸರಸ್ವತಿ ಮಂತ್ರ', 
    name_en: 'Saraswati Mantra for Knowledge and Intellect',
    url: '/saraswati-vidya-mantra.mp3', 
    method: 'ಓದುವ ಮೊದಲು ಅಥವಾ ಓದುವ ಸಮಯದಲ್ಲಿ ಕಡಿಮೆ ಶಬ್ದದಲ್ಲಿ ಕೇಳಿ.',
    method_en: 'Listen at low volume before or during study sessions.',
    benefits: 'ಏಕಾಗ್ರತೆ, ನೆನಪಿನ ಶಕ್ತಿ ಮತ್ತು ಬುದ್ಧಿಶಕ್ತಿ ಹೆಚ್ಚಳ.',
    benefits_en: 'Increased concentration, memory power, and intelligence.',
    tier: "paid",
    category: "protective"
  },
];
