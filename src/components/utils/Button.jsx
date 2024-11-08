import "../../assets/css/button.css"

export const Button = ({ clickAction }) => {
    return (
        <div className="btnPos">
            <button type="button" className="specialBtn" onClick={clickAction}>
                <span>confesar lige</span>
            </button>
        </div>
    )
}
