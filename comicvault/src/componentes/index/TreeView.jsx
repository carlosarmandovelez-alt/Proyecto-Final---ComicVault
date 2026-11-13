// src/componentes/index/TreeView.jsx
import { useState } from 'react';
import styles from './TreeView.module.scss';

function TreeNode({ nodo }) {
    const [abierto, setAbierto] = useState(false);

    const tieneHijos = nodo.hijos && nodo.hijos.length > 0;

    // Iconos según el tipo
    const getIcon = () => {
        if (nodo.tipo === 'raiz') return '📁';
        if (nodo.tipo === 'editorial') return '🏢';
        if (nodo.tipo === 'autor') return '👨‍💻';
        return '📘';
    };

    // Texto a mostrar (si es cómic, mostramos el título)
    const getLabel = () => {
        if (nodo.tipo === 'comic') return nodo.valor.titulo;
        return nodo.valor;
    };

    return (
        <li className={styles.treeNode}>
            <div 
                className={`${styles.nodeHeader} ${tieneHijos ? styles.clickable : ''}`}
                onClick={() => tieneHijos && setAbierto(!abierto)}
            >
                {tieneHijos && (
                    <span className={`${styles.arrow} ${abierto ? styles.open : ''}`}>▶</span>
                )}
                <span className={styles.icon}>{getIcon()}</span>
                <span className={styles.label}>{getLabel()}</span>
                {tieneHijos && (
                    <span className={styles.count}>({nodo.hijos.length})</span>
                )}
            </div>

            {tieneHijos && abierto && (
                <ul className={styles.childrenList}>
                    {nodo.hijos.map((hijo, index) => (
                        <TreeNode key={index} nodo={hijo} />
                    ))}
                </ul>
            )}
        </li>
    );
}

function TreeView({ arbol }) {
    if (!arbol || !arbol.raiz) return null;

    return (
        <div className={styles.treeContainer}>
            <ul className={styles.treeRoot}>
                {arbol.raiz.hijos.map((hijo, index) => (
                    <TreeNode key={index} nodo={hijo} />
                ))}
            </ul>
        </div>
    );
}

export default TreeView;