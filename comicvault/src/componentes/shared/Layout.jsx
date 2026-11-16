import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './Layout.module.scss';

function Layout() {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;