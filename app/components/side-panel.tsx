"use client";
import React, { useState, useEffect } from 'react';


const SidePanel: React.FC = () => {
  const [links, setLinks] = useState<string[]>([
  ]);

  const [newLink, setNewLink] = useState('');

  const ingestTranscripts = async () => {
    try {
      const videoIds = links.map((link) => {
        const url = new URL(link);
        return url.searchParams.get('v');
      });

      for (const videoId of videoIds) {
        if (!videoId) continue;
        console.log(`Ingesting transcript for video ${videoId}...`);
        const response = await fetch(`../api/ingest?id=${videoId}`);
        const result = await response.json();
        console.log(result);
      }

      // After all transcripts have been ingested, generate the datasource
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ doctype: 'md' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log(result);


    } catch (error) {
      console.error('Failed to ingest transcripts:', error);
    }
  };

  const ingestBlog = async () => {
    try {
      const blog_links = links.map((link) => {
        const url = new URL(link);
        return url;
      });
      for (const blog_link of blog_links) {
        console.log(`Ingesting blog ${blog_link}...`);
        const response = await fetch('../api/ingest-blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: blog_link }),
        });
        const result = await response.json();
        console.log(result);
      }
      // After all transcripts have been ingested, generate the datasource
      const doctype = 'md'; // or 'txt', depending on what you want to send

      await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicates that the body contains JSON
        },
        body: JSON.stringify({
          doctype: doctype, // Include the doctype in the request body
        }),
      });

    } catch (error) {
      console.error('Failed to ingest blog:', error);
    }
  }

  const handleAddLink = () => {
    if (newLink) {
      setLinks((prevLinks) => [...prevLinks, newLink]);
      setNewLink(''); // Clear the input after adding
    }
  };

  return (
    <aside className="w-64 h-full bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-4">YouTube Links</h2>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {link}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <input
          type="text"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder="Add new link"
          className="mr-2 p-1 border border-gray-300"
        />
        <button onClick={handleAddLink} className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Link
        </button>
      </div>
      <button onClick={ingestTranscripts} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Ingest Transcripts
      </button>
      <button onClick={ingestBlog} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Ingest Blog
      </button>
    </aside>
  );
};

export default SidePanel;
