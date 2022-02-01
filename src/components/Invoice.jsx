import { Link } from 'react-router-dom'
import iconArrowRight from '../assets/icon-arrow-right.svg'
import '../styles/Invoice.scss'

function Invoice({ invoice }) {
  const {
    invoiceId,
    paymentDueDate,
    clientName,
    invoiceTotal,
    invoicePaid,
    invoiceDraft,
    invoicePending,
  } = invoice

  return (
    <Link to={`/invoice/${invoiceId}`} className="invoice flex">
      <div className="left flex">
        <span className="tracking-number">#{invoiceId}</span>
        <span className="due-date">{paymentDueDate}</span>
        <span className="person">{clientName}</span>
      </div>

      <div className="right flex">
        <span className="price">${invoiceTotal}</span>
        <div
          className={`status-button flex ${invoicePaid ? 'paid' : null} ${
            invoiceDraft ? 'draft' : null
          } ${invoicePending ? 'pending' : null}`}
        >
          {invoicePaid && <span>Paid</span>}
          {invoiceDraft && <span>Draft</span>}
          {invoicePending && <span>Pending</span>}
        </div>
        <div className="icon">
          <img src={iconArrowRight} alt="" />
        </div>
      </div>
    </Link>
  )
}

export default Invoice
