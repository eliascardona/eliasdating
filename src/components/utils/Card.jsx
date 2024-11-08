import { timeDifference } from '../../lib/utils/utils'
import "../../assets/css/card.css"

export const Card = ({ remitente, destinatario, timestamp }) => {
    const date = new Date()
    return (
        <div className="card">
            <strong><b>{remitente}</b></strong>
            <p>Me gusta <b>{destinatario}</b>!</p>
            <span>{timeDifference(date.getTime(), timestamp)}</span>
        </div>
    )
}
