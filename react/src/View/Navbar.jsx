import './Stats.css'
import { Link } from 'react-router-dom'
export default function Navbar() {
    return (
        <>
        <div className='top'>
            <h2 className='topTitle'>Tecnologico</h2>
        </div>
        <div className='navbar'>
            <Link className='timeRange' to="">Hoy</Link>
            <Link className='timeRange' to="">Horas</Link>
            <Link className='timeRange' to="">Semana</Link>
            <Link className='timeRange' to="">Mes</Link>
        </div>
        </>
    )
}
