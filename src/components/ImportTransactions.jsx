import { useState } from 'react'
import {
  parseAndValidateCSV,
  downloadTemplate,
  readFileAsText
} from '../utils/importTransactions'
import '../styles/ImportTransactions.css'

function ImportTransactions({ onImport, onClose }) {
  const [file, setFile] = useState(null)
  const [parseResult, setParseResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      return
    }

    setFile(selectedFile)
    setIsLoading(true)
    setError(null)

    try {
      const content = await readFileAsText(selectedFile)
      const result = parseAndValidateCSV(content)
      setParseResult(result)
    } catch (err) {
      setError(`Error reading file: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = () => {
    if (!parseResult || parseResult.validTransactions.length === 0) {
      setError('No valid transactions to import')
      return
    }

    onImport(parseResult.validTransactions)
    onClose()
  }

  const handleDownloadTemplate = () => {
    downloadTemplate()
  }

  return (
    <div className="import-modal-overlay" onClick={onClose}>
      <div className="import-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="import-modal-header">
          <h2>Import Transactions</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="import-modal-body">
          {!parseResult ? (
            // Step 1: File Selection
            <div className="import-step-1">
              <div className="import-instructions">
                <h3>Upload a CSV File</h3>
                <p>Import multiple transactions at once using a CSV file.</p>

                <div className="format-info">
                  <h4>Required Format:</h4>
                  <ul>
                    <li><strong>Date</strong> - YYYY-MM-DD format</li>
                    <li><strong>Description</strong> - Transaction description</li>
                    <li><strong>Category</strong> - e.g., salary, groceries, utilities</li>
                    <li><strong>Type</strong> - "income" or "expense"</li>
                    <li><strong>Amount</strong> - Numeric value</li>
                  </ul>
                </div>

                <div className="example-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2026-03-15</td>
                        <td>Monthly Salary</td>
                        <td>salary</td>
                        <td>income</td>
                        <td>3500.00</td>
                      </tr>
                      <tr>
                        <td>2026-03-10</td>
                        <td>Grocery Store</td>
                        <td>groceries</td>
                        <td>expense</td>
                        <td>85.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="file-upload-section">
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    id="csv-file-input"
                    disabled={isLoading}
                  />
                  <label htmlFor="csv-file-input" className="file-input-label">
                    {isLoading ? 'Processing...' : 'Choose CSV File'}
                  </label>
                </div>

                {file && (
                  <div className="file-info">
                    <p>Selected: <strong>{file.name}</strong></p>
                  </div>
                )}

                <button
                  className="template-btn"
                  onClick={handleDownloadTemplate}
                  type="button"
                >
                  📥 Download Template
                </button>
              </div>

              {error && (
                <div className="error-message">
                  <p>⚠️ {error}</p>
                </div>
              )}
            </div>
          ) : (
            // Step 2: Preview & Confirmation
            <div className="import-step-2">
              <div className="import-summary">
                <div className="summary-cards">
                  <div className="summary-card valid">
                    <div className="summary-number">{parseResult.summary.validCount}</div>
                    <div className="summary-label">Valid Transactions</div>
                  </div>
                  <div className="summary-card invalid">
                    <div className="summary-number">{parseResult.summary.invalidCount}</div>
                    <div className="summary-label">Invalid Rows</div>
                  </div>
                </div>
              </div>

              {/* Valid Transactions Preview */}
              {parseResult.validTransactions.length > 0 && (
                <div className="preview-section">
                  <h3>Valid Transactions ({parseResult.validTransactions.length})</h3>
                  <div className="transactions-preview">
                    {parseResult.validTransactions.slice(0, 10).map((tx, idx) => (
                      <div key={idx} className="preview-row">
                        <div className="preview-cell date">{tx.dateISO}</div>
                        <div className="preview-cell desc">{tx.description}</div>
                        <div className="preview-cell cat">{tx.category}</div>
                        <div className={`preview-cell type ${tx.type}`}>
                          {tx.type === 'income' ? '+' : '−'} ${tx.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                    {parseResult.validTransactions.length > 10 && (
                      <div className="preview-more">
                        ...and {parseResult.validTransactions.length - 10} more transactions
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Invalid Rows Preview */}
              {parseResult.invalidRows.length > 0 && (
                <div className="preview-section errors">
                  <h3>Issues Found ({parseResult.invalidRows.length})</h3>
                  <div className="error-preview">
                    {parseResult.invalidRows.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="error-item">
                        <div className="error-line">
                          <strong>Row {item.rowIndex}:</strong> {item.row.join(' | ')}
                        </div>
                        <div className="error-details">
                          {item.errors.map((err, errIdx) => (
                            <div key={errIdx} className="error-detail">• {err}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {parseResult.invalidRows.length > 5 && (
                      <div className="errors-more">
                        ...and {parseResult.invalidRows.length - 5} more rows with errors
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="import-modal-footer">
          {!parseResult ? (
            <>
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
            </>
          ) : (
            <>
              <button
                className="btn-secondary"
                onClick={() => {
                  setParseResult(null)
                  setFile(null)
                  setError(null)
                }}
              >
                Back
              </button>
              <button
                className="btn-primary"
                onClick={handleImport}
                disabled={parseResult.validTransactions.length === 0}
              >
                Import {parseResult.summary.validCount} Transaction
                {parseResult.summary.validCount !== 1 ? 's' : ''}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImportTransactions
