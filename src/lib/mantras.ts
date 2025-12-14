export type Mantra = {
  id: number;
  name: string;
  url: string;
  description?: string;
};

// Using placeholder audio files from a public source for a better demo experience
export const mantras: Mantra[] = [
  { 
    id: 9, 
    name: 'ಸರ್ವ ರೋಗ ನಿವಾರಣಾ ಆಂಜನೇಯ ಮಂತ್ರ', 
    url: '/audio/anjaneya-mantra.mp3',
    description: 'ನಾಸೈ ರೋಗ್ ಹರೇ ಸಬ್ ಪೀರಾ, ಜಬತ್ ನಿರಂತರ್ ಹನುಮತ್ ಬೀರಾ\n\nಪ್ರಾಣ ದೇವರಾದ ಹನುಮಂತನ ಈ ಮಂತ್ರವು ದೀರ್ಘಕಾಲ ಕಾಡುವ ಎಲ್ಲಾ ಕಾಯಿಲೆಗಳನ್ನು ಗುಣಮಾಡುವಲ್ಲಿ ಫಲಕಾರಿ, ಸಂಧಿವಾತದಿಂದ ಹಿಡಿದು ಮಾರಕ ಕ್ಯಾನ್ಸರ್ ಕಾಯಿಲೆಯವರೆಗೆ. ಈ ಮಂತ್ರವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು ಮತ್ತು ವಿಧಾನಕ್ಕೆ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.'
  },
  { id: 10, name: 'ಮಾನಸಿಕ ನೋವು, ದುಃಖ, ಚಿಂತೆ ನಿವಾರಣಾ ಹಂಸ ಮಂತ್ರ', url: '/audio/hamsa-mantra.mp3' },
  { id: 11, name: 'ಶತ್ರು ಮತ್ತು ಹಿತಶತ್ರು ನಿವಾರಣಾ ಬಗಲಾಮುಖಿ ಮಂತ್ರ', url: '/audio/bagalamukhi-mantra.mp3' },
  { id: 12, name: 'ಐಶ್ವರ್ಯ ಮತ್ತು ಸಂಪತ್ತಿಗಾಗಿ ಕುಭೇರ ಮಂತ್ರ', url: '/audio/kubera-mantra.mp3' },
  { id: 13, name: 'ಹಣಕಾಸಿನ ಹರಿವಿನ ತೊಡಕಿನ ನಿವಾರಣೆಗೆ ಮಹಾಲಕ್ಷ್ಮಿ ಮಂತ್ರ', url: '/audio/mahalakshmi-mantra.mp3' },
  { id: 14, name: 'ವಿದ್ಯಾ ಬುದ್ದಿಗಾಗಿ ಸರಸ್ವತಿ ಮಂತ್ರ', url: '/audio/saraswati-vidya-mantra.mp3' },
];
