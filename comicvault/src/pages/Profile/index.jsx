import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './index.module.scss';

function Profile() {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [nombre, setNombre] = useState('');
    const [foto, setFoto] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setNombre(user.displayName || '');
            setFoto(user.photoURL || '');
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        await updateUserProfile(nombre, foto);
        setIsSaving(false);
        alert('Perfil actualizado');
    };

    return (
        <div className={styles.profileContainer}>
            <h1>Mi Perfil</h1>
            <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.preview}>
                    <img 
                        src={foto || 'https://via.placeholder.com/150'} 
                        alt="Avatar" 
                    />
                </div>
                <div className={styles.field}>
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        placeholder="Tu nombre"
                    />
                </div>
                <div className={styles.field}>
                    <label>URL de tu foto de perfil:</label>
                    <input 
                        type="text" 
                        value={foto} 
                        onChange={(e) => setFoto(e.target.value)} 
                        placeholder="https://ejemplo.com/mi-foto.jpg"
                    />
                </div>
                <button type="submit" disabled={isSaving} className={styles.btnSave}>
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
}

export default Profile;