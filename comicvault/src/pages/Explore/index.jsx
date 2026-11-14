// src/pages/Explore/index.jsx
import { useContext } from 'react';
import Menu from '../../componentes/shared/Menu';
import TreeView from '../../componentes/index/TreeView';
import { ComicContext } from '../../context/ComicContext';
import styles from './index.module.scss';

function Explore() {
    const { arbol } = useContext(ComicContext);

    return (
        <div className={styles.exploreContainer}>
            <Menu />
            <main className={styles.content}>
                <header className={styles.header}>
                    <h1>Explorar Catálogo</h1>
                    <p>Navega por el árbol de Editoriales y Autores</p>
                </header>
                
                {arbol ? (
                    <div className={styles.treeWrapper}>
                        <TreeView arbol={arbol} />
                    </div>
                ) : (
                    <p className={styles.loading}>Cargando catálogo...</p>
                )}
            </main>
        </div>
    );
}

export default Explore;