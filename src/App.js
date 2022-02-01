import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import InvoiceModal from './components/InvoiceModal'
import Mobile from './components/Mobile'
import Modal from './components/Modal'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import InvoiceView from './pages/InvoiceView'
import NotFound from './pages/NotFound'
import { getAllInvoices } from './services/firebase'
import './styles/App.scss'

function App() {
  const [isMobile, setIsMobile] = useState(false)
  const [invoiceModal, setInvoiceModal] = useState(false)
  const [editInvoice, setEditInvoice] = useState(false)
  const [modal, setModal] = useState(false)
  const [invoiceData, setInvoiceData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function checkScreen() {
    const windowWidth = window.innerWidth
    if (windowWidth <= 750) {
      setIsMobile(true)
      return
    }
    setIsMobile(false)
  }

  async function getInvoices() {
    setIsLoading(true)
    const res = await getAllInvoices()
    setIsLoading(false)
    setInvoiceData(res)
  }

  useEffect(() => {
    checkScreen()
    getInvoices()

    window.addEventListener('resize', checkScreen)
  }, [])

  if (isMobile) return <Mobile />

  return (
    <div className="app flex flex-column">
      <Navigation />
      <TransitionGroup className="app-content flex flex-column">
        <>
          {modal && (
            <Modal
              setInvoiceModal={setInvoiceModal}
              setModal={setModal}
              setEditInvoice={setEditInvoice}
            />
          )}

          <CSSTransition
            in={invoiceModal}
            timeout={300}
            classNames="invoice"
            unmountOnExit
          >
            <InvoiceModal
              setInvoiceModal={setInvoiceModal}
              setModal={setModal}
              editInvoice={editInvoice}
              invoiceData={invoiceData}
              getInvoices={getInvoices}
            />
          </CSSTransition>

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  setInvoiceModal={setInvoiceModal}
                  invoiceData={invoiceData}
                  isLoading={isLoading}
                />
              }
            />
            
            <Route
              path="/invoice/:invoiceId"
              element={
                <InvoiceView
                  setInvoiceModal={setInvoiceModal}
                  setEditInvoice={setEditInvoice}
                  getInvoices={getInvoices}
                />
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      </TransitionGroup>
    </div>
  )
}

export default App
