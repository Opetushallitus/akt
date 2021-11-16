import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';

import { changeLang, getCurrentLang, getSupportedLangs } from 'configs/i18n';

export const LangSelector: FC = () => {
  const { t } = useTranslation();
  const [finnish, swedish, english] = getSupportedLangs();

  const handleLangChange = (event: SelectChangeEvent) => {
    changeLang(event.target.value);
  };

  return (
    <div className="lang-selector">
      <PublicIcon className="lang-selector__icon" fontSize="small" />
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
          <MenuItem value={finnish}> {t('akt.header.lang.fi')}</MenuItem>
          <MenuItem value={swedish}> {t('akt.header.lang.sv')}</MenuItem>
          <MenuItem value={english}> {t('akt.header.lang.en')}</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
