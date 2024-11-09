import '../../assets/css/notification.css'

export const MatchNotification = ({ openNotif, setOpenNotif, notTo, notifStatesParam }) => {
    return (
    <>
        {openNotif && 
        <div className='Notification__globalContainer'>
            <div className='Notification__modalContainer'>
                <div className='Notification__mainLy' style={{gridTemplateColumns:`${notifStatesParam.length<2?'100%':'8% 82% 8%'}`}}>
                    {/* ------------------------- */}
                    <div 
                        className='Notification__child' 
                        style={{height:'80%', width:'200%', display:`${notifStatesParam.length<2?'none':'block'}`}} 
                        onClick={setOpenNotif}
                    >
                        <div>
                            <ion-icon style={{fontSize:'48px'}} name='chevron-back'></ion-icon>
                        </div>
                    </div>
                    {/* ------------------------- */}
                    <div className='Notification__center'>
                        <h2 className='Notification__title'>
                            {
                                notifStatesParam.length < 2 ? 'FELICIDADES, HICISTE MATCH CON' : 'FELICIDADES, ESTOS SON TUS MATCHES'
                            }
                        </h2>
                        <ion-icon style={{fontSize:'64px'}} name='heart'></ion-icon>
                        <h2>{notTo}</h2>
                        <p>¡has hecho match, ve y haz lo tuyo!</p>
                        <span className='Notification__close' style={{display:`${notifStatesParam.length<2?'block':'none'}`}} onClick={setOpenNotif}>
                            cerrar
                        </span>
                    </div>
                    {/* ------------------------- */}
                    <div 
                        className='Notification__child' 
                        style={{height:'80%', width:'200%', display:`${notifStatesParam.length<2?'none':'block'}`}} 
                        onClick={setOpenNotif}
                    >
                        <div>
                            <ion-icon style={{fontSize:'48px'}} name='chevron-forward'></ion-icon>
                        </div>
                    </div>
                    {/* ------------------------- */}
                </div>
            </div>
        </div>        
        }     
    </>
    )
}
