import illustrationEmpty from '../assets/illustration-empty.svg'
import '../styles/NotFound.scss'

function NotFound() {
  return (
    <div className="home container">
      <div className="empty flex flex-column">
        <img src={illustrationEmpty} alt="" />
        <h3>404</h3>
        <p>
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  )
}

export default NotFound
