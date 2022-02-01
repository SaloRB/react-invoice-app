import '../styles/Modal.scss'

function Modal({ setInvoiceModal, setModal, setEditInvoice }) {
  function closeModal() {
    setModal(false)
  }

  function closeInvoice() {
    setModal(false)
    setInvoiceModal(false)
    setEditInvoice(false)
  }
  
  return (
    <div className="modal flex">
      <div className="modal-content">
        <p>Are you sure you want to exit? Your changes will not be saved</p>
        <div className="actions flex">
          <button onClick={closeModal} className="purple">
            Return
          </button>
          <button onClick={closeInvoice} className="red">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
