import { MatchForm } from '../vitals/MatchForm'
import '../../assets/css/modal.css'

export const ModalTwo = ({ openModal, setOpenModal }) => {
    return (
        openModal &&
        <div className='Modal__globalContainer'>
            <div className='Modal__modalContainer'>
                <div className='Modal__mainLy'>
                    <MatchForm />
                    <button type='button' className='Modal__specialBtn' onClick={() => setOpenModal(false)}>
                        cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}
