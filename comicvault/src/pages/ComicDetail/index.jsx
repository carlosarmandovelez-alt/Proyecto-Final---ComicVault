// src/pages/ComicDetail/index.jsx
import { useParams } from 'react-router-dom';

function ComicDetail() {
    const { id } = useParams();

    return (
        <div style={{ padding: '40px', color: 'white', background: '#121212', minHeight: '100vh' }}>
            <h1>Detalle del Cómic</h1>
            <p>ID: {id}</p>
        </div>
    );
}

export default ComicDetail;