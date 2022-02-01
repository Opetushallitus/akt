import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IconButton } from '@mui/material';
import { useEffect } from 'react';

import {
  ChosenTranslatorsHeading,
  StepHeading,
  stepsByIndex,
} from 'components/contactRequest/ContactRequestFormUtils';
import { Text } from 'components/elements/Text';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { removeSelectedTranslator } from 'redux/actions/publicTranslator';
import { selectedPublicTranslatorsForLanguagePair } from 'redux/selectors/publicTranslator';

export const VerifySelectedTranslators = ({
  disableNext,
}: {
  disableNext: (disabled: boolean) => void;
}) => {
  const translators = useAppSelector(selectedPublicTranslatorsForLanguagePair);
  const dispatch = useAppDispatch();

  const deselectTranslator = (id: number) =>
    dispatch(removeSelectedTranslator(id));

  useEffect(
    () => disableNext(translators.length == 0),
    [disableNext, translators]
  );

  return (
    <div className="rows">
      <StepHeading step={stepsByIndex[0]} />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        {translators.map(({ id, firstName, lastName }) => (
          <div
            className="columns"
            key={id}
            data-testid={`contact-request-page__chosen-translator-id-${id}`}
          >
            <Text>
              {firstName} {lastName}
            </Text>
            <IconButton onClick={() => deselectTranslator(id)}>
              <DeleteOutlineIcon className="contact-request-page__delete-outline-icon" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};
