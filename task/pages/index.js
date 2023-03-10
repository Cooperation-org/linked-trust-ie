/* 
Add css help of Head  Component on Specific web page 
*/

// import head component
import Head from "next/head";
//  import css
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      {/* use head and add meta tag in head component  */}
      <Head>
        <title>Impact Evaluator</title>
      </Head>
      {/* use layout and add other ui component  */}

      <div className={styles.grid}>
        <h1 className={styles.title}> Home page </h1>
        <p className={styles.paragraf}>
          The Impact Evaluator POC.................................
          ....................................................................
          ..............
        </p>
      </div>
    </>
  );
}
