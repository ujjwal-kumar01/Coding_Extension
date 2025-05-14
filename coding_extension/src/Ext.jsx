import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Ext() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [notes, setNote] = useState('');
  const [topics, setTopics] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab?.title) setTitle(tab.title);
      });
    }
  }, []);

  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ You must be logged in to save!');
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
      if (!tab?.url) {
        alert('⚠️ Could not get current tab URL!');
        return;
      }

      const data = {
        title,
        url: tab.url,
        notes,
        topics: topics.split(',').map(t => t.trim()).filter(Boolean),
      };

      try {
        const response = await fetch('http://localhost:8000/question-ext/v1/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          setNote('');
          setTopics('');
          alert('✅ Saved successfully!');
          navigate('/home');
        } else {
          console.error(result);
          alert('❌ Failed to save: ' + (result.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Network error:', err);
        alert('⚠️ Error connecting to backend!');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-300 to-blue-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-[300px]">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-5">🔖 Bookmark Question</h2>

        {!isLoggedIn ? (
          <>
            <p className="text-center text-sm text-gray-700 mb-4">Please log in to add bookmarks.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-coral-500 hover:bg-gray-300 hover:border-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 font-semibold py-2 rounded-md transition duration-300 text-sm"
            >
              🔐 Login
            </button>
          </>
        ) : (
          <>
            <div className="space-y-3 text-sm">
              <div>
                <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>
              <div>
                <label htmlFor="note" className="block text-gray-700 font-medium mb-1">Note</label>
                <textarea
                  id="note"
                  value={notes}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write your notes here..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y text-sm"
                />
              </div>
              <div>
                <label htmlFor="topics" className="block text-gray-700 font-medium mb-1">Topics</label>
                <input
                  id="topics"
                  type="text"
                  placeholder="e.g. DP, Graphs"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-300 text-sm"
            >
              💾 Save Bookmark
            </button>

            <button
              onClick={() => navigate('/home')}
              className="w-full mt-2 bg-green-500 hover:bg-green-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 font-semibold py-2 rounded-md transition duration-300 text-sm"
            >
              🏠 Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Ext;
