import '../styles/Navigation.scss'
import logo from '../assets/file-invoice-dollar-solid.png'

function Navigation() {
  return (
    <header className="flex">
      <div className="branding flex">
        <img src={logo} alt="" />
      </div>
    </header>
  )
}

export default Navigation
