import '../../assets/css/button.css'

export const Button = ({ clickAction }) => {
    return (
        <div className='Button__btnPos'>
            <button type='button' className='Button__specialBtn' onClick={clickAction}>
                <span>confesar lige</span>
            </button>
        </div>
    )
}
