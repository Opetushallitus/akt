interface LanguagePair {
  from: string;
  to: string;
}

export interface TranslatorDetails {
  name: string;
  languagePairs: Array<LanguagePair>;
  hometown: string;
}
