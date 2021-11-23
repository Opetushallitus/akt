import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

import { changeLang, getCurrentLang, getSupportedLangs } from 'configs/i18n';

export const LangSelector: FC = () => {
  const { t } = useTranslation();
  const [finnish, swedish, english] = getSupportedLangs();

  const handleLangChange = (event: SelectChangeEvent) => {
    changeLang(event.target.value);
  };

  return (
    <div className="lang-selector">
      <LanguageIcon className="lang-selector__icon" fontSize="small" />
      <FormControl>
        <Select
          autoWidth
          disableUnderline
          variant="standard"
          value={getCurrentLang()}
          onChange={handleLangChange}
          className="lang-selector__select"
          data-testid="lang-selector"
        >
          <MenuItem value={finnish}>
            {t('akt.component.header.lang.fi')}
          </MenuItem>
          <MenuItem value={swedish}>
            {t('akt.component.header.lang.sv')}
          </MenuItem>
          <MenuItem value={english}>
            {t('akt.component.header.lang.en')}
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
