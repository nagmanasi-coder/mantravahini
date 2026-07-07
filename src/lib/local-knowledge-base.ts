export type KnowledgeEntry = {
  keywords: string[];
  kn: string;
  en: string;
};

/**
 * INTERNAL KNOWLEDGE BASE
 * No cloud API required. Rules-based matching for instant local responses.
 */
export const LOCAL_KNOWLEDGE: KnowledgeEntry[] = [
  {
    keywords: ["kali", "ಕಾಳಿ", "water", "ನೀರು", "pain", "ನೋವು"],
    kn: "ಕಾಳಿ ಮಂತ್ರ ವಿಧಾನ: ಒಂದು ಲೋಟ ನೀರು ತೆಗೆದುಕೊಳ್ಳಿ, ಲೌಡ್ ಸ್ಪೀಕರ್‌ನಲ್ಲಿ ಮಂತ್ರ ಪ್ಲೇ ಮಾಡಿ. ಆ ನೀರನ್ನು ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಕುಡಿಯಿರಿ. ಇದು ಶಾರೀರಿಕ ನೋವು ನಿವಾರಣೆಗೆ ಆಧ್ಯಾತ್ಮಿಕ ಬೆಂಬಲ ನೀಡುತ್ತದೆ.",
    en: "Kali Mantra Method: Take a glass of water, play the mantra on loudspeaker. Drink it twice a day. It provides spiritual support for physical pain relief."
  },
  {
    keywords: ["eye", "ಕಣ್ಣು", "chakshu", "ಚಾಕ್ಷುಷ", "vision"],
    kn: "ಚಾಕ್ಷುಷ ಮಂತ್ರ ವಿಧಾನ: ಹೆಡ್‌ಫೋನ್ ಬಳಸಿ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಕೇಳಿ. ಇದು ಕಣ್ಣಿನ ಆರೋಗ್ಯಕ್ಕೆ ಮತ್ತು ಏಕಾಗ್ರತೆಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    en: "Chakshu Mantra Method: Listen twice daily using headphones. It helps with eye health and mental focus."
  },
  {
    keywords: ["deeksha", "ದೀಕ್ಷೆ", "initiation", "whatsapp"],
    kn: "ಮಂತ್ರ ದೀಕ್ಷೆ ಪಡೆಯಲು: ನಿಮ್ಮ ಹೆಸರು, ತಾಯಿಯ ಹೆಸರು ಮತ್ತು ಸ್ಥಳವನ್ನು 7022070287 ಸಂಖ್ಯೆಗೆ WhatsApp ಮಾಡಿ. ಇದು ಉಚಿತ ಮತ್ತು ಆನ್‌ಲೈನ್ ಮೂಲಕ ನೀಡಲಾಗುತ್ತದೆ.",
    en: "To receive Mantra Deeksha: WhatsApp your Name, Mother's Name, and Place to 7022070287. It is free and conducted online."
  },
  {
    keywords: ["prana", "ಪ್ರಾಣ", "level", "ಹಂತ", "practitioner"],
    kn: "ಪ್ರಾಣ ವಿದ್ಯಾ ೩ ಹಂತಗಳನ್ನು ಹೊಂದಿದೆ: ೧. ಪ್ರಾಣಸ್ಪರ್ಶಿ (ತರಬೇತಿ), ೨. ಪ್ರಾಣಚಿಕಿತ್ಸಕ (೧೦ ಜನರನ್ನು ಸೇರಿಸಿದಾಗ), ೩. ಪ್ರಾಣ ಆಚಾರ್ಯ (ಮಾಸ್ಟರ್ ಹಂತ). ಇದು ಜೀವನ ಶಕ್ತಿಯನ್ನು ಹೆಚ್ಚಿಸುವ ವಿಧಾನ.",
    en: "Prana Vidya has 3 levels: 1. Pranasparshi (Basic), 2. Prana Chikitsaka (after 10 referrals), 3. Prana Acharya (Master). It is a life-force enhancement method."
  },
  {
    keywords: ["upgrade", "premium", "ಅಪ್‌ಗ್ರೇಡ್", "ಪ್ರೀಮಿಯಂ", "price", "ಬೆಲೆ"],
    kn: "ಪ್ರೀಮಿಯಂ ಬೆಲೆ ತಿಂಗಳಿಗೆ ₹೧೯೯. ಇದು ಆಫ್‌ಲೈನ್ ಮಂತ್ರಗಳು, ದೀಕ್ಷೆ ಮತ್ತು ತಜ್ಞರ ಬೆಂಬಲವನ್ನು ಒಳಗೊಂಡಿದೆ. ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಲು ಪ್ರೊಫೈಲ್ ಮೆನು ಬಳಸಿ.",
    en: "Premium costs ₹199/month. It includes offline access, Guru Deeksha eligibility, and expert support. Use the Profile menu to upgrade."
  },
  {
    keywords: ["oil", "ತೈಲ", "hair", "skin", "ಚರ್ಮ"],
    kn: "ನಮ್ಮಲ್ಲಿ ವಿಶೇಷ ಮಂತ್ರ ಚಾಲಿತ ತೈಲಗಳಿವೆ: ಹೇರ್ ಆಯಿಲ್ (₹೨೯೯), ಕನಕ ತೈಲ (ಚರ್ಮ - ₹೪೯೯), ಕನಕಧಾರಾ ತೈಲ (ಚೈತನ್ಯ - ₹೯೯೯). ಆರ್ಡರ್ ಮಾಡಲು WhatsApp ಮಾಡಿ.",
    en: "We offer mantra-infused oils: Hair Oil (₹299), Kanaka Oil (Skin - ₹499), Kanakadhara Oil (Vitality - ₹999). WhatsApp to order."
  },
  {
    keywords: ["akshaya", "box", "cash", "ಬಾಕ್ಸ್", "ಹಣ"],
    kn: "ಅಕ್ಷಯ ಕ್ಯಾಶ್ ಬಾಕ್ಸ್: ಇದು ಮನೆ ಅಥವಾ ವ್ಯಾಪಾರ ಸ್ಥಳದಲ್ಲಿ ಹಣದ ಹರಿವನ್ನು ಹೆಚ್ಚಿಸಲು ಮತ್ತು ಅಡೆತಡೆಗಳನ್ನು ನಿವಾರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಬೆಲೆಗೆ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    en: "Akshaya Cash Box: Helps increase financial flow and remove obstacles at home or business. Contact us for pricing."
  },
  {
    keywords: ["horoscope", "bhavishya", "ಭವಿಷ್ಯ", "rashi", "ರಾಶಿ"],
    kn: "ಕಾಲಜ್ಞಾನ ವಿಭಾಗದಲ್ಲಿ ನಿಮ್ಮ ರಾಶಿ ಅಥವಾ ಲಗ್ನದ ಆಧಾರದ ಮೇಲೆ ಪ್ರತಿದಿನದ ಆಧ್ಯಾತ್ಮಿಕ ಭವಿಷ್ಯವನ್ನು ಉಚಿತವಾಗಿ ಪಡೆಯಬಹುದು.",
    en: "In the Kalajnana section, you can get free daily spiritual predictions based on your Rashi (Moon Sign) or Lagna (Ascendant)."
  },
  {
    keywords: ["referral", "link", "ಲಿಂಕ್", "earn", "ಪ್ರತಿಫಲ"],
    kn: "೩ ಸ್ನೇಹಿತರನ್ನು ಸೇರಿಸುವ ಮೂಲಕ ೧ ತಿಂಗಳ ಪ್ರೀಮಿಯಂ ಉಚಿತವಾಗಿ ಪಡೆಯಿರಿ. ನಿಮ್ಮ ಲಿಂಕ್ ಅನ್ನು ಪ್ರೊಫೈಲ್ ಮೆನುವಿನಲ್ಲಿರುವ 'Refer & Earn' ನಲ್ಲಿ ಪಡೆಯಿರಿ.",
    en: "Invite 3 active friends to unlock 1 month of Free Premium. Get your unique link from 'Refer & Earn' in the Profile menu."
  }
];

export const DEFAULT_RESPONSE = {
  kn: "ಕ್ಷಮಿಸಿ, ಆ ಬಗ್ಗೆ ಮಾಹಿತಿ ಇಲ್ಲ. ದಯವಿಟ್ಟು ಕೀವರ್ಡ್ ಬಳಸಿ (ಉದಾಹರಣೆಗೆ: ಕಾಳಿ, ದೀಕ್ಷೆ, ತೈಲ, ಪ್ರೀಮಿಯಂ). ಅಥವಾ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ: 7022070287.",
  en: "Sorry, I don't have information on that. Try keywords like: Kali, Deeksha, Oil, Premium. Or contact us: 7022070287."
};
