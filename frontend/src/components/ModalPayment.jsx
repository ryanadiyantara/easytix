import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

const ModalPayment = ({
  isOpen,
  onClose,
  title = "Modal Title",
  bodyContent = null,
  modalBgColor = "none",
  modalBackdropFilter = "blur(1px)",
  onConfirm = () => {},
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay bg={modalBgColor} backdropFilter={modalBackdropFilter} />
        <ModalContent borderRadius="15px" boxShadow="none" p={4} maxW="400px" w="90%">
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{bodyContent}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onConfirm}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalPayment;
