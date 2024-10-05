import { useEffect, useState } from 'react'
import { RxEnter } from "react-icons/rx";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/list');
      setUrlList(response.data.result);
    } catch (error) {
      console.error('Error fetching URL list:', error);
      setError('Failed to fetch URL list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/short-url', { originalUrl });
      setOriginalUrl('');
      fetchList();
    } catch (error) {
      console.error('Error shortening URL:', error);
      setError('Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickCount = async (e, shortedUrl, originalUrl) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.get(`/s/${shortedUrl}`);
      window.open(`${originalUrl}`, '_blank');
      fetchList();

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const renderTable = () => (
    <div className="mb-8 text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Previous Links</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100 border-b-2 border-gray-300 text-center">
          <tr>
            <th className="px-4 py-2">Original URL</th>
            <th className="px-4 py-2">Shortened URL</th>
            <th className="px-4 py-2">Click Count</th>
          </tr>
        </thead>
        <tbody>
          {urlList.map((item) => (
            <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">{item.originalUrl}</td>
              <td className="px-4 py-3">
                <a
                  href={item.originalUrl}
                  onClick={(e) => handleClickCount(e, item.shortedUrl, item.originalUrl)}
                  rel="noopener noreferrer"
                >
                  {item.shortedUrl}
                </a>

              </td>
              <td className="px-4 py-3 flex justify-center">{item.clickCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="py-11 px-5 text-center">
        <h1 className='text-4xl font-bold text-[#dbd6d6] mb-4'>URL Shortener</h1>
        <p className='text-gray-500 text-lg mb-6'>
          Shorten your URLs quickly and easily.
        </p>
        <form onSubmit={handleShorten} className="flex justify-center items-center gap-2">
          <input
            type="text"
            onChange={(e) => setOriginalUrl(e.target.value)}
            value={originalUrl}
            required
            placeholder="Paste your URL here."
            className="w-full max-w-lg px-4 text-black py-2 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            className="bg-pink-500 text-white p-2 rounded-r-lg hover:bg-pink-600 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Loading...' : <RxEnter className="text-2xl" />}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      {renderTable()}
    </>
  )
}

export default App;
