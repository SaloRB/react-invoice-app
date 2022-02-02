import { collection, query, where, getDocs } from 'firebase/firestore'
import db from '../utils/firebaseInit'

export async function getAllInvoices() {
  const data = []
  const results = await getDocs(collection(db, 'invoices'))

  results.forEach((doc) => {
    data.push({
      id: doc.id,
      invoiceId: doc.data().invoiceId,
      billerStreetAddress: doc.data().billerStreetAddress,
      billerCity: doc.data().billerCity,
      billerZipCode: doc.data().billerZipCode,
      billerCountry: doc.data().billerCountry,
      clientName: doc.data().clientName,
      clientEmail: doc.data().clientEmail,
      clientStreetAddress: doc.data().clientStreetAddress,
      clientCity: doc.data().clientCity,
      clientZipCode: doc.data().clientZipCode,
      clientCountry: doc.data().clientCountry,
      invoiceDateUnix: doc.data().invoiceDateUnix,
      invoiceDate: doc.data().invoiceDate,
      paymentTerms: doc.data().paymentTerms,
      paymentDueDateUnix: doc.data().paymentDueDateUnix,
      paymentDueDate: doc.data().paymentDueDate,
      productDescription: doc.data().productDescription,
      invoiceItemList: doc.data().invoiceItemList,
      invoiceTotal: doc.data().invoiceTotal,
      invoicePending: doc.data().invoicePending,
      invoiceDraft: doc.data().invoiceDraft,
      invoicePaid: doc.data().invoicePaid,
    })
  })

  return data
}

export async function getInvoiceById(invoiceId) {
  const data = []
  const q = query(
    collection(db, 'invoices'),
    where('invoiceId', '==', invoiceId)
  )

  const invoice = await getDocs(q)

  invoice.forEach((doc) => {
    data.push({
      id: doc.id,
      invoiceId: doc.data().invoiceId,
      billerStreetAddress: doc.data().billerStreetAddress,
      billerCity: doc.data().billerCity,
      billerZipCode: doc.data().billerZipCode,
      billerCountry: doc.data().billerCountry,
      clientName: doc.data().clientName,
      clientEmail: doc.data().clientEmail,
      clientStreetAddress: doc.data().clientStreetAddress,
      clientCity: doc.data().clientCity,
      clientZipCode: doc.data().clientZipCode,
      clientCountry: doc.data().clientCountry,
      invoiceDateUnix: doc.data().invoiceDateUnix,
      invoiceDate: doc.data().invoiceDate,
      paymentTerms: doc.data().paymentTerms,
      paymentDueDateUnix: doc.data().paymentDueDateUnix,
      paymentDueDate: doc.data().paymentDueDate,
      productDescription: doc.data().productDescription,
      invoiceItemList: doc.data().invoiceItemList,
      invoiceTotal: doc.data().invoiceTotal,
      invoicePending: doc.data().invoicePending,
      invoiceDraft: doc.data().invoiceDraft,
      invoicePaid: doc.data().invoicePaid,
    })
  })

  return data
}
