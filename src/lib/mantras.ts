export type Mantra = {
  id: number;
  name: string;
  url: string;
};

// Using placeholder audio files from a public source for a better demo experience
export const mantras: Mantra[] = [
  { id: 1, name: 'ನೋವು ನಿವಾರಣಾ ಕಾಳಿ ಮಂತ್ರ (ತಕ್ಷಣದ ಪರಿಣಾಮ)', url: '/audio/kali-mantra.mp3' },
  { id: 2, name: 'ಗಾಯತ್ರಿ ಮಂತ್ರ', url: '/audio/gayatri-mantra.mp3' },
  { id: 3, name: 'ಮಹಾ ಮೃತ್ಯುಂಜಯ ಮಂತ್ರ', url: '/audio/maha-mrityunjaya-mantra.mp3' },
  { id: 4, name: 'ಓಂ ನಮಃ ಶಿವಾಯ', url: '/audio/om-namah-shivaya.mp3' },
  { id: 5, name: 'ಹರೇ ಕೃಷ್ಣ ಮಂತ್ರ', url: '/audio/hare-krishna-mantra.mp3' },
  { id: 6, name: 'ಓಂ ನಮೋ ಭಗವತೇ ವಾಸುದೇವಾಯ', url: '/audio/om-namo-bhagavate.mp3' },
  { id: 7, name: 'ಸರಸ್ವತಿ ವಂದನಾ', url: '/audio/saraswati-vandana.mp3' },
];
