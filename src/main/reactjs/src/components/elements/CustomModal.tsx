import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const defaultStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface CustomModalProps {
  children: JSX.Element;
  open: boolean;
  handleCloseModal: () => void;
}

export const CustomModal = ({
  children,
  open,
  handleCloseModal,
}: CustomModalProps): JSX.Element => {
  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={defaultStyle}>{children}</Box>
    </Modal>
  );
};
