// src/componentes/index/GraphView.jsx
import { useState } from 'react';
import styles from './GraphView.module.scss';

function GraphView({ grafo }) {
    const [selectedNode, setSelectedNode] = useState(null);

    if (!grafo) return null;

    const nodesData = grafo.getNodesData();
    const nodeIds = Object.keys(nodesData);

    if (nodeIds.length === 0) return <p className={styles.empty}>No hay cómics para relacionar.</p>;

    // Si no hay seleccionado, mostramos el primero por defecto
    const currentId = selectedNode || nodeIds[0];
    const currentComic = nodesData[currentId];
    const connections = grafo.getNeighbors(currentId);

    return (
        <div className={styles.graphContainer}>
            {/* Selector de cómic */}
            <div className={styles.selector}>
                <label>Selecciona un cómic:</label>
                <select 
                    value={currentId} 
                    onChange={(e) => setSelectedNode(e.target.value)}
                >
                    {nodeIds.map(id => (
                        <option key={id} value={id}>{nodesData[id].titulo}</option>
                    ))}
                </select>
            </div>

            {/* Visualización del Grafo */}
            <div className={styles.visualGraph}>
                {/* Nodo Central */}
                <div className={styles.centerNode}>
                    <span className={styles.icon}>📘</span>
                    <span>{currentComic.titulo}</span>
                </div>

                {/* Conexiones */}
                {connections.length > 0 ? (
                    <div className={styles.connectionsGrid}>
                        <h4>🔗 Conexiones encontradas ({connections.length}):</h4>
                        <div className={styles.connectionCards}>
                            {connections.map(id => {
                                const conn = nodesData[id];
                                return (
                                    <div key={id} className={styles.connectionCard}>
                                        <p className={styles.connTitle}>{conn.titulo}</p>
                                        <p className={styles.connDetail}>
                                            {conn.autor === currentComic.autor && '✍️ Mismo Autor'}
                                            {conn.autor === currentComic.autor && conn.editorial === currentComic.editorial && ' | '}
                                            {conn.editorial === currentComic.editorial && '🏢 Misma Editorial'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className={styles.noConnections}>Este cómic no tiene conexiones (es único en su autor/editorial).</p>
                )}
            </div>
        </div>
    );
}

export default GraphView;