import { useState } from 'react'
import { useEffect } from 'react/cjs/react.development'
import iconArrowDown from '../assets/icon-arrow-down.svg'
import iconPlus from '../assets/icon-plus.svg'
import illustrationEmpty from '../assets/illustration-empty.svg'
import Invoice from '../components/Invoice'
import Loading from '../components/Loading'
import '../styles/Home.scss'

function Home({ setInvoiceModal, invoiceData, isLoading }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredInvoice, setFilteredInvoice] = useState(null)
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    setFilteredData(
      invoiceData.filter((invoice) => {
        if (filteredInvoice === 'Draft') {
          return invoice.invoiceDraft === true
        }
        if (filteredInvoice === 'Pending') {
          return invoice.invoicePending === true
        }
        if (filteredInvoice === 'Paid') {
          return invoice.invoicePaid === true
        }
        return invoice
      })
    )
  }, [filteredInvoice, invoiceData])

  function toggleFilterMenu() {
    setIsOpen(!isOpen)
  }

  function filteredInvoices(e) {
    if (e.target.innerText === 'Clear Filter') {
      setFilteredInvoice(null)
      return
    }

    setFilteredInvoice(e.target.innerText)
  }

  function newInvoice() {
    setInvoiceModal(true)
  }

  if (isLoading) return <Loading />

  return (
    <div className="home container">
      {/* Header */}
      <div className="header flex">
        <div className="left flex-column">
          <h1>Invoices</h1>
          <span>There are {invoiceData.length} total invoices</span>
        </div>
        <div className="right flex">
          <div onClick={toggleFilterMenu} className="filter flex">
            <span>
              Filter by status
              {filteredInvoice && <span>: {filteredInvoice}</span>}
            </span>
            <img src={iconArrowDown} alt="" />
            {isOpen && (
              <ul className="filter-menu">
                <li onClick={filteredInvoices}>Draft</li>
                <li onClick={filteredInvoices}>Pending</li>
                <li onClick={filteredInvoices}>Paid</li>
                <li onClick={filteredInvoices}>Clear Filter</li>
              </ul>
            )}
          </div>
          <div onClick={newInvoice} className="button flex">
            <div className="inner-button flex">
              <img src={iconPlus} alt="" />
            </div>
            <span>New Invoice</span>
          </div>
        </div>
      </div>

      {/* Invoices */}
      {invoiceData.length > 0 ? (
        <>
          {filteredData.map((invoice, index) => (
            <Invoice key={index} invoice={invoice} />
          ))}
        </>
      ) : (
        <div className="empty flex flex-column">
          <img src={illustrationEmpty} alt="" />
          <h3>There is nothing here</h3>
          <p>
            Create a new invoice by clicking the New Invoice button and get
            started
          </p>
        </div>
      )}
    </div>
  )
}

export default Home
