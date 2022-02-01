import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import iconArrowLeft from '../assets/icon-arrow-left.svg'
import '../styles/InvoiceView.scss'
import { getInvoiceById } from '../services/firebase'
import { updateDoc, doc, deleteDoc } from 'firebase/firestore'
import db from '../firebase/firebaseInit'
import Loading from '../components/Loading'
import NotFound from './NotFound'

function InvoiceView({ setInvoiceModal, setEditInvoice, getInvoices }) {
  const navigate = useNavigate()

  const [invoice, setInvoice] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { invoiceId } = useParams()

  useEffect(() => {
    getInvoice(invoiceId)
  }, [invoiceId])

  async function getInvoice(id) {
    setIsLoading(true)
    const res = await getInvoiceById(id)
    setInvoice(res[0])
    setIsLoading(false)
  }

  function toggleEditInvoice() {
    setInvoiceModal(true)
    setEditInvoice(true)
  }

  async function deleteInvoice(docId) {
    await deleteDoc(doc(db, 'invoices', docId))
    getInvoices()
    navigate('/')
  }

  async function updateStatusToPaid(docId) {
    setIsLoading(true)

    await updateDoc(doc(db, 'invoices', docId), {
      invoicePaid: true,
      invoicePending: false,
    })

    getInvoices()

    setInvoice({
      ...invoice,
      invoicePaid: true,
      invoicePending: false,
    })

    setIsLoading(false)
  }

  async function updateStatusToPending(docId) {
    setIsLoading(true)

    await updateDoc(doc(db, 'invoices', docId), {
      invoicePaid: false,
      invoicePending: true,
      invoiceDraft: false,
    })

    getInvoices()

    setInvoice({
      ...invoice,
      invoicePaid: false,
      invoicePending: true,
    })

    setIsLoading(false)
  }

  if (!invoice) return <NotFound />

  if (isLoading) return <Loading />

  return (
    <div className="invoice-view container">
      <Link className="nav-link flex" to="/">
        <img src={iconArrowLeft} alt="" />
        Go Back
      </Link>

      {/* Header */}
      <div className="header flex">
        <div className="left flex">
          <span>Status</span>
          <div
            className={`status-button flex ${invoice.invoicePaid && 'paid'} ${
              invoice.invoicePending && 'pending'
            } ${invoice.invoiceDraft && 'draft'}`}
          >
            {invoice.invoicePaid && <span>Paid</span>}
            {invoice.invoicePending && <span>Pending</span>}
            {invoice.invoiceDraft && <span>Draft</span>}
          </div>
        </div>
        <div className="right flex">
          <button onClick={toggleEditInvoice} className="dark-purple">
            Edit
          </button>
          <button onClick={() => deleteInvoice(invoice.id)} className="red">
            Delete
          </button>
          {invoice.invoicePending && (
            <button
              onClick={() => updateStatusToPaid(invoice.id)}
              className="green"
            >
              Mark as Paid
            </button>
          )}
          {(invoice.invoiceDraft || invoice.invoicePaid) && (
            <button
              onClick={() => updateStatusToPending(invoice.id)}
              className="orange"
            >
              Mark as Pending
            </button>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <div className="invoice-details flex flex-column">
        <div className="top flex">
          <div className="left flex flex-column">
            <p>
              <span>#</span>
              {invoice.invoiceId}
            </p>
            <p>{invoice.productDescription}</p>
          </div>
          <div className="right flex flex-column">
            <p>{invoice.billerStreetAddress}</p>
            <p>{invoice.billerCity}</p>
            <p>{invoice.billerZipCode}</p>
            <p>{invoice.billerCountry}</p>
          </div>
        </div>

        <div className="middle flex">
          <div className="payment flex flex-column">
            <h4>Invoice Date</h4>
            <p>{invoice.invoiceDate}</p>
            <h4>Payment Date</h4>
            <p>{invoice.paymentDueDate}</p>
          </div>
          <div className="bill flex flex-column">
            <h4>Bill To</h4>
            <p>{invoice.clientName}</p>
            <p>{invoice.clientStreetAddress}</p>
            <p>{invoice.clientCity}</p>
            <p>{invoice.clientZipCode}</p>
            <p>{invoice.clientCountry}</p>
          </div>
          <div className="send-to flex flex-column">
            <h4>Sent To</h4>
            <p>{invoice.clientEmail}</p>
          </div>
        </div>

        <div className="bottom flex flex-column">
          <div className="billing-items">
            <div className="heading flex">
              <p>Item Name</p>
              <p>Qty</p>
              <p>Price</p>
              <p>Total</p>
            </div>

            {invoice.invoiceItemList &&
              invoice.invoiceItemList.map((item, index) => (
                <div key={index} className="item flex">
                  <p>{item.itemName}</p>
                  <p>{item.qty}</p>
                  <p>${item.price}</p>
                  <p>${item.total}</p>
                </div>
              ))}
          </div>

          <div className="total flex">
            <p>Amount Due</p>
            <p>${invoice.invoiceTotal}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceView
