import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function ViewForm({ form, show, handleClose }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={false}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{form.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <h5 className="mb-4">{form.message}</h5>
          {form.component}
        </>
      </Modal.Body>
    </Modal>
  );
}
