import DarkVeil from '../../components/Background/DarkVeil.tsx';
import Header from '../../components/Header/Header.tsx';

export default function Main() {
    return (
        <div>
            <Header />
            <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
                <DarkVeil />
            </div>
        </div>
    );
}
