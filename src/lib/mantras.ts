export type Mantra = {
  id: number;
  name: string;
  name_en: string;
  url: string;
  description?: string;
  description_en?: string;
  tier: "free" | "paid";
  category: "life" | "disease";
};

export const mantras: Mantra[] = [
  {
    id: 1,
    name: 'ನೋವು ನಿವಾರಣೆಗೆ ಶಕ್ತಿಶಾಲಿ ಕಾಳಿ ಮಂತ್ರ',
    name_en: 'Powerful Kali Mantra for Pain Relief',
    url: '/kali-mantra.mp3',
    tier: "free",
    category: "disease",
  },
  {
    id: 2,
    name: 'ಕಣ್ಣಿನ ಸಮಸ್ಯೆಗಳಿಗೆ ಶಕ್ತಿಶಾಲಿ ಚಾಕ್ಷುಷ ಮಂತ್ರ',
    name_en: 'Powerful Chakshu Mantra for Eye Problems',
    url: '/chakshu-mantra.mp3',
    tier: "paid",
    category: "disease",
  },
  { 
    id: 9, 
    name: 'ಸರ್ವ ರೋಗ ನಿವಾರಣಾ ಆಂಜನೇಯ ಮಂತ್ರ', 
    name_en: 'Anjaneya Mantra for All Diseases',
    url: '/audio/anjaneya-mantra.mp3',
    description: 'ನಾಸೈ ರೋಗ್ ಹರೇ ಸಬ್ ಪೀರಾ, ಜಬತ್ ನಿರಂತರ್ ಹನುಮತ್ ಬೀರಾ\n\nಪ್ರಾಣ ದೇವರಾದ ಹನುಮಂತನ ಈ ಮಂತ್ರವು ದೀರ್ಘಕಾಲ ಕಾಡುವ ಎಲ್ಲಾ ಕಾಯಿಲೆಗಳನ್ನು ಗುಣಮಾಡುವಲ್ಲಿ ಫಲಕಾರಿ, ಸಂಧಿವಾತದಿಂದ ಹಿಡಿದು ಮಾರಕ ಕ್ಯಾನ್ಸರ್ ಕಾಯಿಲೆಯವರೆಗೆ. ಈ ಮಂತ್ರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಮತ್ತು ವಿಧಾನಕ್ಕೆ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.\n\nStarts from 5500/-, ಕಾಯಿಲೆ, ಕಾಯಿಲೆಯ ತೀವ್ರತೆ, ವಯಸ್ಸು ಇದರ ಆಧಾರದ ಮೇಲೆ ಮಂತ್ರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿಕೊಳ್ಳಬೇಕು',
    description_en: 'Nasai Rog Hare Sab Peera, Japat Nirantar Hanumat Beera\n\nThis mantra of Lord Hanuman is effective in curing all long-lasting diseases, from arthritis to fatal cancer. Contact the center to activate this mantra and for the procedure.\n\nStarts from 5500/-, the mantra must be activated based on the disease, its severity, and age.',
    tier: "paid",
    category: "disease"
  },
  { 
    id: 11, 
    name: 'ಶತ್ರು ಮತ್ತು ಹಿತಶತ್ರು ನಿವಾರಣಾ ಬಗಲಾಮುಖಿ ಮಂತ್ರ', 
    name_en: 'Bagalamukhi Mantra for Enemy & Hidden Enemy Removal',
    url: '/audio/bagalamukhi-mantra.mp3',
    description: 'ಓಂ ಹ್ಲೀಂ ಬಗಲಾಮುಖೀ ದೇವ್ಯೈ ಸರ್ವ ದುಷ್ಟಾನಾಮ್ ವಾಚಂ ಮುಖಂ ಪದಮ್ ಸ್ತಂಭಯ ಜಿಹ್ವಾಮ್ ಕೀಲಯ-ಕೀಲಯ ಬುದ್ಧಿಂ ವಿನಾಶಾಯ ಹ್ಲೀಂ ಓಂ ನಮಃ\n\nಈ ಮಂತ್ರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಮತ್ತು ವಿಧಾನಕ್ಕೆ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ. 5500/-',
    description_en: 'Om Hleem Bagalamukhi Devyai Sarva Dushtanam Vacham Mukham Padam Stambhaya Jihvam Keelaya-Keelaya Buddhim Vinashaya Hleem Om Namah\n\nContact the center to activate this mantra and for the procedure. 5500/-',
    tier: "paid",
    category: "life"
  },
  { 
    id: 10, 
    name: 'ಮಾನಸಿಕ ನೋವು, ದುಃಖ, ಚಿಂತೆ ನಿವಾರಣಾ ಹಂಸ ಮಂತ್ರ', 
    name_en: 'Hamsa Mantra for Mental Pain, Sorrow, and Worry Removal',
    url: '/audio/hamsa-mantra.mp3', 
    description: 'ಹಂಸ: ಹಂಸ:\n\nಈ ಮಂತ್ರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಮತ್ತು ವಿಧಾನಕ್ಕೆ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ. 5500/-', 
    description_en: 'Hamsa: Hamsa:\n\nContact the center to activate this mantra and for the procedure. 5500/-',
    tier: "paid",
    category: "life"
  },
  { 
    id: 16, 
    name: 'ಸಾಲ, ಋಣ ನಿವಾರಣೆಯ ಶುಕ್ರಾಚಾರ್ಯ ಮಂತ್ರ',
    name_en: 'Shukracharya Mantra for Debt Removal',
    url: '/audio/shukracharya-mantra.mp3', 
    tier: "paid",
    category: "life"
  },
  { 
    id: 15, 
    name: 'ಮಹಾ ಆಕರ್ಷಣ ಮಂತ್ರ', 
    name_en: 'Maha Akarshana (Great Attraction) Mantra',
    url: '/audio/maha-akarshana-mantra.mp3', 
    tier: "paid",
    category: "life"
  },
  { 
    id: 12, 
    name: 'ಐಶ್ವರ್ಯ ಮತ್ತು ಸಂಪತ್ತಿಗಾಗಿ ಕುಭೇರ ಮಂತ್ರ', 
    name_en: 'Kubera Mantra for Wealth and Prosperity',
    url: '/audio/kubera-mantra.mp3', 
    tier: "paid",
    category: "life"
  },
  { 
    id: 13, 
    name: 'ಹಣಕಾಸಿನ ಹರಿವಿನ ತೊಡಕಿನ ನಿವಾರಣೆಗೆ ಮಹಾಲಕ್ಷ್ಮಿ ಮಂತ್ರ', 
    name_en: 'Mahalakshmi Mantra for Overcoming Financial Obstacles',
    url: '/audio/mahalakshmi-mantra.mp3', 
    tier: "paid",
    category: "life"
  },
  { 
    id: 14, 
    name: 'ವಿದ್ಯಾ ಬುದ್ದಿಗಾಗಿ ಸರಸ್ವತಿ ಮಂತ್ರ', 
    name_en: 'Saraswati Mantra for Knowledge and Intellect',
    url: '/audio/saraswati-vidya-mantra.mp3', 
    tier: "paid",
    category: "life"
  },
];