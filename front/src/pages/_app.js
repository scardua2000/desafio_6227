import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

if (typeof window !== "undefined") {
  const objItens = [];
  
  localStorage.setItem('items', JSON.stringify(objItens));
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
