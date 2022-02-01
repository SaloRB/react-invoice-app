import { useRef, useState, useEffect } from 'react'
import '../styles/InvoiceModal.scss'
import iconDelete from '../assets/icon-delete.svg'
import iconPlus from '../assets/icon-plus.svg'
import { uid } from 'uid'
import Loading from './Loading'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import db from '../firebase/firebaseInit.js'

function InvoiceModal({
  setInvoiceModal,
  setModal,
  editInvoice,
  invoiceData,
  getInvoices,
}) {
  const invoiceWrap = useRef()

  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  const [isLoading, setIsLoading] = useState(false)

  const [docId, setDocId] = useState('')

  const [data, setData] = useState({
    billerStreetAddress: '',
    billerCity: '',
    billerZipCode: '',
    billerCountry: '',
    clientName: '',
    clientEmail: '',
    clientStreetAddress: '',
    clientCity: '',
    clientZipCode: '',
    clientCountry: '',
    invoiceDateUnix: '',
    invoiceDate: '',
    paymentDueDateUnix: '',
    paymentDueDate: '',
    paymentTerms: '',
    productDescription: '',
    invoicePending: '',
    invoiceDraft: '',
    invoiceItemList: [],
    invoiceTotal: 0,
  })

  useEffect(() => {
    const futureDate = new Date()

    if (!editInvoice) {
      setData({
        ...data,
        invoiceDateUnix: Date.now(),
        invoiceDate: new Date().toLocaleDateString('en-us', dateOptions),
        paymentTerms: '30',
        paymentDueDateUnix: futureDate.setDate(futureDate.getDate() + 30),
        paymentDueDate: new Date(
          futureDate.setDate(futureDate.getDate())
        ).toLocaleDateString('en-us', dateOptions),
      })
    }

    if (editInvoice) {
      const invoiceId = window.location.href.split('/')[4]

      const currentInvoice = invoiceData.find(
        (invoice) => invoice.invoiceId === invoiceId
      )

      setDocId(currentInvoice.id)

      setData({
        billerStreetAddress: currentInvoice.billerStreetAddress,
        billerCity: currentInvoice.billerCity,
        billerZipCode: currentInvoice.billerZipCode,
        billerCountry: currentInvoice.billerCountry,
        clientName: currentInvoice.clientName,
        clientEmail: currentInvoice.clientEmail,
        clientStreetAddress: currentInvoice.clientStreetAddress,
        clientCity: currentInvoice.clientCity,
        clientZipCode: currentInvoice.clientZipCode,
        clientCountry: currentInvoice.clientCountry,
        invoiceDateUnix: currentInvoice.invoiceDateUnix,
        invoiceDate: currentInvoice.invoiceDate,
        paymentTerms: currentInvoice.paymentTerms,
        paymentDueDateUnix: currentInvoice.paymentDueDateUnix,
        paymentDueDate: currentInvoice.paymentDueDate,
        productDescription: currentInvoice.productDescription,
        invoicePending: currentInvoice.invoicePending,
        invoiceDraft: currentInvoice.invoiceDraft,
        invoicePaid: currentInvoice.invoicePaid,
        invoiceItemList: currentInvoice.invoiceItemList,
        invoiceTotal: currentInvoice.invoiceTotal,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function closeInvoice() {
    setInvoiceModal(false)
  }

  function checkClick(e) {
    if (e.target === invoiceWrap.current) {
      setModal(true)
    }
  }

  function handleChange(e) {
    const value = e.target.value

    if (!e.target.dataset.id) {
      setData({
        ...data,
        [e.target.name]: value,
      })
    } else {
      setData({
        ...data,
        invoiceItemList: data.invoiceItemList.map((item) => {
          if (item.id === e.target.dataset.id) {
            return {
              ...item,
              [e.target.name]: value,
            }
          }
          return item
        }),
      })
    }
  }

  function paymentTerms(e) {
    const futureDate = new Date()

    const value = e.target.value

    const dueDateUnix = futureDate.setDate(futureDate.getDate() + +value)

    const paymentDueDate = new Date(dueDateUnix).toLocaleDateString(
      'en-us',
      dateOptions
    )

    setData({
      ...data,
      paymentDueDateUnix: dueDateUnix,
      paymentDueDate: paymentDueDate,
      paymentTerms: value,
    })
  }

  function addNewInvoiceItem() {
    setData({
      ...data,
      invoiceItemList: [
        ...data.invoiceItemList,
        {
          id: uid(),
          itemName: '',
          qty: '',
          price: 0,
          total: 0,
        },
      ],
    })
  }

  function deleteInvoiceItem(id) {
    setData({
      ...data,
      invoiceItemList: data.invoiceItemList.filter((item) => item.id !== id),
    })
  }

  function saveDraft() {
    setData({
      ...data,
      invoiceItemList: data.invoiceItemList.map((item) => {
        item.total = item.qty * item.price
        return item
      }),
      invoiceTotal: data.invoiceItemList.reduce((acc, item) => {
        return acc + item.total
      }, 0),
      invoiceDraft: true,
      invoicePending: false,
    })
  }

  function savePending() {
    setData({
      ...data,
      invoiceItemList: data.invoiceItemList.map((item) => {
        item.total = item.qty * item.price
        return item
      }),
      invoiceTotal: data.invoiceItemList.reduce((acc, item) => {
        return acc + item.total
      }, 0),
      invoiceDraft: false,
      invoicePending: true,
    })
  }

  function updateValues() {
    setData({
      ...data,
      invoiceItemList: data.invoiceItemList.map((item) => {
        item.total = item.qty * item.price
        return item
      }),
      invoiceTotal: data.invoiceItemList.reduce((acc, item) => {
        return acc + item.total
      }, 0),
    })
  }

  function submitForm(e) {
    e.preventDefault()

    if (editInvoice) {
      updateInvoice()
      return
    }

    uploadInvoice()
  }

  async function uploadInvoice() {
    if (data.invoiceItemList.length <= 0) {
      alert('Please add at least one item to the invoice.')
      return
    }

    setIsLoading(true)

    await addDoc(collection(db, 'invoices'), {
      invoiceId: uid(6),
      billerStreetAddress: data.billerStreetAddress,
      billerCity: data.billerCity,
      billerZipCode: data.billerZipCode,
      billerCountry: data.billerCountry,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientStreetAddress: data.clientStreetAddress,
      clientCity: data.clientCity,
      clientZipCode: data.clientZipCode,
      clientCountry: data.clientCountry,
      invoiceDate: data.invoiceDate,
      invoiceDateUnix: data.invoiceDateUnix,
      paymentTerms: data.paymentTerms,
      paymentDueDate: data.paymentDueDate,
      paymentDueDateUnix: data.paymentDueDateUnix,
      productDescription: data.productDescription,
      invoiceItemList: data.invoiceItemList,
      invoiceTotal: data.invoiceTotal,
      invoicePending: data.invoicePending,
      invoiceDraft: data.invoiceDraft,
      invoicePaid: null,
    })

    setIsLoading(false)

    setInvoiceModal(false)

    getInvoices()
  }

  async function updateInvoice() {
    if (data.invoiceItemList.length <= 0) {
      alert('Please add at least one item to the invoice.')
      return
    }

    setIsLoading(true)

    const invoiceRef = doc(db, 'invoices', docId)

    await updateDoc(invoiceRef, {
      billerStreetAddress: data.billerStreetAddress,
      billerCity: data.billerCity,
      billerZipCode: data.billerZipCode,
      billerCountry: data.billerCountry,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientStreetAddress: data.clientStreetAddress,
      clientCity: data.clientCity,
      clientZipCode: data.clientZipCode,
      clientCountry: data.clientCountry,
      paymentTerms: data.paymentTerms,
      paymentDueDate: data.paymentDueDate,
      paymentDueDateUnix: data.paymentDueDateUnix,
      productDescription: data.productDescription,
      invoiceItemList: data.invoiceItemList,
      invoiceTotal: data.invoiceTotal,
    })

    window.location.reload()
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div
      onClick={checkClick}
      className="invoice-wrap flex flex-column"
      ref={invoiceWrap}
    >
      <form onSubmit={submitForm} className="invoice-content">
        {!editInvoice ? <h1>New Invoice</h1> : <h1>Edit Invoice</h1>}

        {/* Bill From */}
        <div className="bill-from flex flex-column">
          <h4>Bill From</h4>

          <div className="input flex flex-column">
            <label htmlFor="billerStreetAddress">Street Address</label>
            <input
              required
              type="text"
              value={data.billerStreetAddress}
              onChange={handleChange}
              id="billerStreetAddres"
              name="billerStreetAddress"
            />
          </div>

          <div className="location-details flex">
            <div className="input flex flex-column">
              <label htmlFor="billerCity">City</label>
              <input
                required
                type="text"
                value={data.billerCity}
                onChange={handleChange}
                id="billerCity"
                name="billerCity"
              />
            </div>

            <div className="input flex flex-column">
              <label htmlFor="billerZipCode">Zip Code</label>
              <input
                required
                type="text"
                value={data.billerZipCode}
                onChange={handleChange}
                id="billerZipCode"
                name="billerZipCode"
              />
            </div>

            <div className="input flex flex-column">
              <label htmlFor="billerCountry">Country</label>
              <input
                required
                type="text"
                value={data.billerCountry}
                onChange={handleChange}
                id="billerCountry"
                name="billerCountry"
              />
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="bill-to flex flex-column">
          <h4>Bill To</h4>

          <div className="input flex flex-column">
            <label htmlFor="clientName">Client's Name</label>
            <input
              required
              type="text"
              value={data.clientName}
              onChange={handleChange}
              id="clientName"
              name="clientName"
            />
          </div>

          <div className="input flex flex-column">
            <label htmlFor="clientEmail">Client's Email</label>
            <input
              required
              type="text"
              value={data.clientEmail}
              onChange={handleChange}
              id="clientEmail"
              name="clientEmail"
            />
          </div>

          <div className="input flex flex-column">
            <label htmlFor="clientStreetAddres">Street Address</label>
            <input
              required
              type="text"
              value={data.clientStreetAddress}
              onChange={handleChange}
              id="clientStreetAddress"
              name="clientStreetAddress"
            />
          </div>

          <div className="location-details flex">
            <div className="input flex flex-column">
              <label htmlFor="clientCity">City</label>
              <input
                required
                type="text"
                value={data.clientCity}
                onChange={handleChange}
                id="clientCity"
                name="clientCity"
              />
            </div>

            <div className="input flex flex-column">
              <label htmlFor="clientZipCode">Zip Code</label>
              <input
                required
                type="text"
                value={data.clientZipCode}
                onChange={handleChange}
                id="clientZipCode"
                name="clientZipCode"
              />
            </div>

            <div className="input flex flex-column">
              <label htmlFor="clientCountry">Country</label>
              <input
                required
                type="text"
                value={data.clientCountry}
                onChange={handleChange}
                id="clientCountry"
                name="clientCountry"
              />
            </div>
          </div>
        </div>

        {/* Invoice Work Details */}
        <div className="invoice-work flex flex-column">
          <div className="payment flex">
            <div className="input flex flex-column">
              <label htmlFor="invoiceDate">Invoice Date</label>
              <input
                disabled
                type="text"
                defaultValue={data.invoiceDate}
                id="invoiceDate"
                name="invoiceDate"
              />
            </div>

            <div className="input flex flex-column">
              <label htmlFor="paymentDueDate">Payment Due</label>
              <input
                disabled
                type="text"
                defaultValue={data.paymentDueDate}
                id="paymentDueDate"
                name="paymentDueDate"
              />
            </div>
          </div>

          <div className="input flex flex-column">
            <label htmlFor="paymentTerms">Payment Terms</label>
            <select
              required
              id="paymentTerms"
              value={data.paymentTerms}
              onChange={paymentTerms}
              name="paymentTerms"
            >
              <option value="30">Net 30 Days</option>
              <option value="60">Net 60 Days</option>
            </select>
          </div>

          <div className="input flex flex-column">
            <label htmlFor="ProductDescription">Product Description</label>
            <input
              required
              type="text"
              value={data.productDescription}
              onChange={handleChange}
              name="productDescription"
              id="productDescription"
            />
          </div>

          <div className="work-items">
            <h3>Item List</h3>
            <table className="item-list">
              <thead>
                <tr className="table-heading flex">
                  <th className="item-name">Item Name</th>
                  <th className="qty">Qty</th>
                  <th className="price">Price</th>
                  <th className="total">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.invoiceItemList.map((item, index) => (
                  <tr key={index} className="table-items flex">
                    <td className="item-name">
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={handleChange}
                        name="itemName"
                        data-id={item.id}
                      />
                    </td>
                    <td className="qty">
                      <input
                        type="text"
                        value={item.qty}
                        onChange={handleChange}
                        name="qty"
                        data-id={item.id}
                      />
                    </td>
                    <td className="price">
                      <input
                        type="text"
                        value={item.price}
                        onChange={handleChange}
                        name="price"
                        data-id={item.id}
                      />
                    </td>
                    <td className="total flex">
                      ${item.qty * item.price || 0}
                    </td>

                    <img
                      onClick={() => deleteInvoiceItem(item.id)}
                      src={iconDelete}
                      alt=""
                    />
                  </tr>
                ))}
              </tbody>
            </table>

            <div onClick={addNewInvoiceItem} className="flex button">
              <img src={iconPlus} alt="" />
              Add New Item
            </div>
          </div>
        </div>

        {/* Save/Exit */}
        <div className="save flex">
          <div className="left">
            <button type="button" onClick={closeInvoice} className="red">
              Cancel
            </button>
          </div>
          <div className="right">
            {!editInvoice && (
              <button onClick={saveDraft} type="submit" className="dark-purple">
                Save Draft
              </button>
            )}
            {!editInvoice && (
              <button onClick={savePending} type="submit" className="purple">
                Create Invoice
              </button>
            )}
            {editInvoice && (
              <button onClick={updateValues} type="submit" className="purple">
                Update Invoice
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default InvoiceModal
