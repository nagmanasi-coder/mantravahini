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
  category: "life" | "disease";
};

export const mantras: Mantra[] = [
  {
    id: 1,
    name: 'ನೋವು ನಿವಾರಣೆಗೆ ಶಕ್ತಿಶಾಲಿ ಕಾಳಿ ಮಂತ್ರ',
    name_en: 'Powerful Kali Mantra for Pain Relief',
    url: '/kali-mantra.mp3',
    method: 'ಒಂದು ಲೋಟ ಶುದ್ಧ ಕುಡಿಯುವ ನೀರನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ. ಲೌಡ್ ಸ್ಪೀಕರ್ ಆನ್ ಮಾಡಿ ಮಂತ್ರವನ್ನು ಪ್ಲೇ ಮಾಡಿ. ಆ ನೀರನ್ನು ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಕುಡಿಯಿರಿ.',
    method_en: 'Take a glass of clean drinking water. Play the mantra near the water with loudspeaker on. Drink the water twice a day.',
    benefits: 'ದೇಹ ಮತ್ತು ಕೀಲು ನೋವಿನಿಂದ ತಕ್ಷಣದ ಪರಿಹಾರ. ದೈಹಿಕ ಶಕ್ತಿ ಹೆಚ್ಚಳ.',
    benefits_en: 'Immediate relief from body and joint pain. Increased physical energy.',
    description: 'ಈ ಕಾಳಿ ಮಂತ್ರವು ದೈಹಿಕ ನೋವುಗಳನ್ನು ಗುಣಪಡಿಸಲು ಮತ್ತು ಶಕ್ತಿಯನ್ನು ತುಂಬಲು ಬಹಳ ಶಕ್ತಿಯುತವಾಗಿದೆ. ಇದನ್ನು ಶ್ರದ್ಧೆಯಿಂದ ಅಭ್ಯಾಸ ಮಾಡಿ.',
    description_en: 'This Kali mantra is very powerful for healing physical pain and infusing energy. Practice with devotion.',
    tier: "free",
    category: "disease",
  },
  {
    id: 2,
    name: 'ಕಣ್ಣಿನ ಸಮಸ್ಯೆಗಳಿಗೆ ಶಕ್ತಿಶಾಲಿ ಚಾಕ್ಷುಷ ಮಂತ್ರ',
    name_en: 'Powerful Chakshu Mantra for Eye Problems',
    url: '/chakshu-mantra.mp3',
    method: 'ಹೆಡ್‌ಫೋನ್ ಅಥವಾ ಇಯರ್‌ಫೋನ್ ಬಳಸಿ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಮಂತ್ರವನ್ನು ಕೇಳಿ.',
    method_en: 'Listen to the mantra twice a day using headphones or earphones.',
    benefits: 'ಕಣ್ಣಿನ ದೃಷ್ಟಿ ಸುಧಾರಣೆ, ಕಣ್ಣಿನ ಕಿರಿಕಿರಿ ಮತ್ತು ವಿವಿಧ ಸಮಸ್ಯೆಗಳಿಂದ ಮುಕ್ತಿ.',
    benefits_en: 'Improved eyesight, relief from eye irritation and various vision problems.',
    description: 'ಪ್ರಾಚೀನ ನೇತ್ರ ಜ್ಯೋತಿ ಮಂತ್ರವು ಕಣ್ಣಿನ ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡಲು ಮತ್ತು ದೃಷ್ಟಿ ದೋಷಗಳನ್ನು ನಿವಾರಿಸಲು ಪ್ರಸಿದ್ಧವಾಗಿದೆ.',
    description_en: 'An ancient mantra famous for protecting eye health and correcting vision issues.',
    tier: "paid",
    category: "disease",
  },
  {
    id: 3,
    name: 'ರೋಗ ಮುಕ್ತಿ ಮಂಗಳ ಸ್ತೋತ್ರ',
    name_en: 'Rog Mukti Mangala Stotra',
    url: '/roga-mukti-stotra.mp3',
    method: 'ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಶ್ರದ್ಧೆಯಿಂದ ಕೇಳಿ. ಮನೆಯಲ್ಲಿ ಪ್ಲೇ ಮಾಡುವುದರಿಂದ ಸಕಾರಾತ್ಮಕ ಶಕ್ತಿ ಹೆಚ್ಚುತ್ತದೆ.',
    method_en: 'Listen with devotion twice a day. Playing it at home increases positive energy and healing vibrations.',
    benefits: 'ದೀರ್ಘಕಾಲದ ಕಾಯಿಲೆಗಳಿಂದ ಮುಕ್ತಿ ಮತ್ತು ಶಾರೀರಿಕ ದೌರ್ಬಲ್ಯ ನಿವಾರಣೆ.',
    benefits_en: 'Relief from long-standing diseases and removal of physical weakness.',
    description: 'ಈ ಸ್ತೋತ್ರವು ರೋಗಗಳನ್ನು ನಿವಾರಿಸಲು ಮತ್ತು ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡಲು ಅತ್ಯಂತ ಮಂಗಳಕರವಾಗಿದೆ.',
    description_en: 'This stotra is highly auspicious for warding off illnesses and maintaining robust health.',
    tier: "paid",
    category: "disease",
  },
  { 
    id: 9, 
    name: 'ಸರ್ವ ರೋಗ ನಿವಾರಣಾ ಆಂಜನೇಯ ಮಂತ್ರ', 
    name_en: 'Anjaneya Mantra for All Diseases',
    url: '/anjaneya-mantra.mp3',
    method: 'ಈ ಮಂತ್ರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಮತ್ತು ಸರಿಯಾದ ವಿಧಾನಕ್ಕೆ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    method_en: 'Contact the center to activate this mantra and learn the specific procedure.',
    benefits: 'ಸಂಧಿವಾತದಿಂದ ಹಿಡಿದು ಮಾರಕ ಕಾಯಿಲೆಗಳವರೆಗೆ ಎಲ್ಲಾ ರೀತಿಯ ದೀರ್ಘಕಾಲದ ರೋಗಗಳ ಗುಣಪಡಿಸುವಿಕೆ.',
    benefits_en: 'Healing of all types of chronic diseases, from arthritis to major ailments.',
    description: 'ಪ್ರಾಣ ದೇವರಾದ ಹನುಮಂತನ ಈ ಮಂತ್ರವು ದೀರ್ಘಕಾಲ ಕಾಡುವ ಎಲ್ಲಾ ಕಾಯಿಲೆಗಳನ್ನು ಗುಣಮಾಡುವಲ್ಲಿ ಫಲಕಾರಿ. ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆ ಅಗತ್ಯ.',
    description_en: 'This mantra of Lord Hanuman is effective in curing long-standing diseases. Requires personalized activation.',
    tier: "paid",
    category: "disease"
  },
  { 
    id: 17, 
    name: 'ಸರ್ವ ಭಯ ಮತ್ತು ಸಂಕಷ್ಟ ನಿವಾರಣಾ ಭೈರವ ಮಂತ್ರ', 
    name_en: 'Bhairava Mantra for Removal of All Fear & Troubles',
    url: '/bhairava-mantra.mp3',
    assetId: 'bhairava-avesha-mamtra-mp3',
    method: 'ಹೆಡ್‌ಫೋನ್ ಅಥವಾ ಇಯರ್‌ಫೋನ್ ಬಳಸಿ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಮಂತ್ರವನ್ನು ಕೇಳಿ.',
    method_en: 'Listen to the mantra twice a day using headphones or earphones.',
    benefits: 'ಎಲ್ಲಾ ರೀತಿಯ ಭಯ, ಆತಂಕ ಮತ್ತು ಜೀವನದ ಸಂಕಷ್ಟಗಳ ನಿವಾರಣೆ. ಮಾನಸಿಕ ಸ್ಥೈರ್ಯ.',
    benefits_en: 'Removal of all types of fear, anxiety, and life\'s obstacles. Mental strength.',
    description: 'ಭೈರವ ಮಂತ್ರವು ರಕ್ಷಣೆ ಮತ್ತು ಧೈರ್ಯವನ್ನು ನೀಡುವ ಅತ್ಯಂತ ಪ್ರಭಾವಶಾಲಿ ಮಂತ್ರವಾಗಿದೆ.',
    description_en: 'Bhairava mantra is a highly influential mantra for protection and courage.',
    tier: "paid",
    category: "life"
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
    category: "life"
  },
  { 
    id: 10, 
    name: 'ಮಾನಸಿಕ ನೋವು, ದುಃಖ, ಚಿಂತೆ ನಿವಾರಣಾ ಹಂಸ ಮಂತ್ರ', 
    name_en: 'Hamsa Mantra for Mental Pain, Sorrow, and Worry Removal',
    url: '/hamsa-mantra.mp3', 
    method: 'ಈ ಮಂತ್ರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಮತ್ತು ಸರಿಯಾದ ವಿಧಾನಕ್ಕೆ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    method_en: 'Contact the center to activate this mantra and for the procedure.',
    benefits: 'ಮಾನಸಿಕ ನೋವು, ದುಃಖ ಮತ್ತು ಚಿಂತೆಗಳಿಂದ ಮುಕ್ತಿ. ಮನಸ್ಸಿಗೆ ಶಾಂತಿ ಮತ್ತು ಪ್ರಶಾಂತತೆ.',
    benefits_en: 'Freedom from mental pain, sorrow, and worry. Peace and tranquility for the mind.',
    description: 'ಹಂಸ ಮಂತ್ರವು ಉಸಿರಾಟದ ಜೊತೆಗೂಡಿ ಮನಸ್ಸನ್ನು ಶುದ್ಧೀಕರಿಸುವ ಸಕ್ರಿಯ ಮಂತ್ರವಾಗಿದೆ.',
    description_en: 'The Hamsa mantra is an active mantra that purifies the mind in sync with breathing.',
    tier: "paid",
    category: "life"
  },
  { 
    id: 16, 
    name: 'ಸಾಲ, ಋಣ ನಿವಾರಣೆಯ ಶುಕ್ರಾಚಾರ್ಯ ಮಂತ್ರ',
    name_en: 'Shukracharya Mantra for Debt Removal',
    url: '/shukracharya-mantra.mp3', 
    method: 'ಹೆಡ್‌ಫೋನ್ ಬಳಸಿ ಶ್ರದ್ಧೆಯಿಂದ ಪ್ರತಿದಿನ ಕೇಳಿ.',
    method_en: 'Listen daily with devotion using headphones.',
    benefits: 'ಸಾಲದ ಬಾಧೆಗಳಿಂದ ಮುಕ್ತಿ ಮತ್ತು ಆರ್ಥಿಕ ಸ್ಥಿರತೆ.',
    benefits_en: 'Freedom from debt burdens and financial stability.',
    tier: "paid",
    category: "life"
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
    category: "life"
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
    category: "life"
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
    category: "life"
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
    category: "life"
  },
];