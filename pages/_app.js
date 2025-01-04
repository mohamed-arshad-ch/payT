import { Poppins } from 'next/font/google';
import '../styles/globals.css'; // Your global CSS file

const poppins = Poppins({
  subsets: ['latin'], // Add the subsets you need
  weight: ['400', '600', '700'], // Specify the weights you use
});

export default function App({ Component, pageProps }) {
  return (
    <div className={poppins.className}>
      <Component {...pageProps} />
    </div>
  );
}