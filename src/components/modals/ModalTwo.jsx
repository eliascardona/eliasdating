import { MatchForm } from '../vitals/MatchForm'
import "../../assets/css/modal.css"

export const ModalTwo = ({ openModal, setOpenModal }) => {
    return (
        openModal &&
        <div className="globalContainer">
            <div className="modalContainer">
                <div className="mainLy">
                    <MatchForm />
                    <button type="button" className="specialBtn" onClick={() => setOpenModal(false)}>
                        cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}
