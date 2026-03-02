import '../styles/ConfirmModal.css'

/**
 * Reusable Confirmation Modal Component
 * Generic modal for confirmation dialogs
 * Can be used for any confirmation action (delete, discard, etc.)
 */
function ConfirmModal({ isOpen, title, message, cancelText = 'Cancel', confirmText = 'Confirm', onCancel, onConfirm, isDangerous = false }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-footer">
          <button 
            className="modal-btn modal-btn-cancel" 
            onClick={onCancel}
            type="button"
          >
            {cancelText}
          </button>
          <button 
            className={`modal-btn modal-btn-confirm ${isDangerous ? 'modal-btn-danger' : ''}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
