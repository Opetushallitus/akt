import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { SelectChangeEvent } from '@mui/material';
import { FC } from 'react';

import { Dropdown } from 'components/elements/Dropdown';
import {
  changeLang,
  getCurrentLang,
  getSupportedLangs,
  useAppTranslation,
} from 'configs/i18n';

export const LangSelector: FC = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.component.header' });
  const [finnish, swedish, english] = getSupportedLangs();

  const values = new Map<string, string>([
    [t('lang.fi'), finnish],
    [t('lang.sv'), swedish],
    [t('lang.en'), english],
  ]);

  const handleLangChange = (event: SelectChangeEvent) => {
    changeLang(event.target.value);
  };

  return (
    <div className="lang-selector">
      <LanguageOutlinedIcon className="lang-selector__icon" fontSize="small" />
      <Dropdown
        disableUnderline
        values={values}
        variant="standard"
        value={getCurrentLang()}
        onChange={handleLangChange}
        className="lang-selector__select"
        data-testid="lang-selector"
      />
    </div>
  );
};
