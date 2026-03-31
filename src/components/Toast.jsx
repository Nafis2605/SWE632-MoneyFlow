/**
 * Toast Component
 * Displays temporary non-blocking feedback messages
 * Auto-dismisses after configurable duration
 */

import { useEffect } from 'react'
import '../styles/Toast.css'

function Toast({ message, type = 'success', duration = 3000, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDismiss) {
        onDismiss()
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' && <span className="toast-icon">✓</span>}
        {type === 'error' && <span className="toast-icon">✕</span>}
        {type === 'info' && <span className="toast-icon">ℹ</span>}
        <p className="toast-message">{message}</p>
      </div>
    </div>
  )
}

export default Toast
