// src/app/home/page.js
import NavBar from '../components/NavBar';
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
      <NavBar />
      <main className={styles.mainContent}>
        <h1>Welcome to the Home Page</h1>
        <p>This is the home page of your website.</p>
      </main>
    </div>
  );
}