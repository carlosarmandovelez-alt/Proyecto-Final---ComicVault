// src/componentes/shared/Tabs.jsx
import { useState } from 'react';
import styles from './Tabs.module.scss';

function Tabs({ tabs }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabHeaders}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`${styles.tabBtn} ${activeTab === index ? styles.active : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className={styles.tabContent}>
                {tabs[activeTab].content}
            </div>
        </div>
    );
}

export default Tabs;