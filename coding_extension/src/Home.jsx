import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/question-ext/v1/get', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Unauthorized or fetch failed');
      const data = await res.json();
      setQuestions(data || []);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/question-ext/v1/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setQuestions(prev => prev.filter(q => q._id !== id));
      } else {
        console.error('Delete failed');
      }
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  const handleEdit = async (q) => {
    const updatedTitle = prompt("Edit Title:", q.title);
    const updatedNotes = prompt("Edit Notes:", q.notes);
    const updatedTopics = prompt("Edit Topics (comma separated):", q.topics.join(', '));

    if (!updatedTitle || !updatedTopics) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/question-ext/v1/edit/${q._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updatedTitle,
          notes: updatedNotes,
          topics: updatedTopics.split(',').map(t => t.trim()),
        }),
      });

      if (res.ok) fetchQuestions();
      else console.error('Edit failed');
    } catch (err) {
      console.error('Error editing question:', err);
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(filter.toLowerCase()) ||
    q.topics?.some(topic => topic.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className=" bg-gradient-to-br from-mint-300 to-blue-200 p-6 relative w-190">
      <button
        onClick={handleLogout}
        className="absolute top-8 right-8 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold shadow z-10"
      >
        🚪 Logout
      </button>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-semibold shadow z-10"
      >
        🔙 Back
      </button>

      <div className="max-w-3xl mx-auto bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-blue-900 mb-6">📘 Your Saved Coding Questions</h2>

        <input
          type="text"
          placeholder="🔍 Filter by title or topic..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-md text-center text-lg text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-mint-400"
        />

        {loading ? (
          <p className="text-center text-gray-700 text-lg">⏳ Loading your questions...</p>
        ) : filteredQuestions.length === 0 ? (
          <p className="text-center text-gray-700 text-lg">😕 No matching questions found.</p>
        ) : (
          <div className="grid gap-6 ">
            {filteredQuestions.map((q) => (
              <div
                key={q._id}
                className=" w-[90%] bg-gray-300 hover:bg-gray-400 p-5 rounded-lg shadow-md transition-transform hover:scale-[1.015] border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-blue-800 mb-1">{q.title}</h3>
                <a
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:underline font-semibold mb-2 inline-block"
                >
                  🔗 Open Link
                </a>
                <p className="text-sm text-gray-800 mb-1"><strong>Note:</strong> {q.notes}</p>
                <p className="text-sm text-gray-700"><strong>Topics:</strong> {q.topics?.join(', ')}</p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleEdit(q)}
                    className="bg-sky-400 hover:bg-sky-500 text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
