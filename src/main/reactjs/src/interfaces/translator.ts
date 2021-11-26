interface LanguagePair {
  from: string;
  to: string;
}

export interface TranslatorDetails {
  id: number;
  name: string;
  languagePairs: Array<LanguagePair>;
  town: string;
  country: string;
}

export interface ApiTranslatorDetails {
  id: number;
  firstName: string;
  lastName: string;
  languagePairs: [
    { fromLang: string; toLang: string; permissionToPublish: boolean }
  ];
  town: string;
  country: string;
}

export interface PublicTranslatorListApiResponse {
  content: Array<ApiTranslatorDetails>;
  numberOfElements: number;
  totalElements: number;
}
