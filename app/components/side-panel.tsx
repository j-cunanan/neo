"use client";
import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { PlusIcon, ReloadIcon } from '@radix-ui/react-icons'
import { FileWrap } from '../utils/file';
import { URLDetailContent } from '../client/fetch/url';

export async function fetchSiteContent(
  site: string | URL,
): Promise<URLDetailContent> {
  const response = await fetch(`/api/fetch?site=${site}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data as URLDetailContent;
}

const SidePanel: React.FC = () => {
  const [links, setLinks] = useState<string[]>([
  ]);

  const [newLink, setNewLink] = useState('');

  const ingestTranscripts = async () => {
    setIsLoading(true);
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
        body: JSON.stringify({ doctype: 'txt' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      console.error('Failed to ingest transcripts:', error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const ingestBlog = async () => {
    setIsLoading(true);
    try {
      const blog_links = links.map((link) => {
        const url = new URL(link);
        return url;
      });
      for (const blog_link of blog_links) {
        console.log(`Ingesting blog ${blog_link}...`);
        const response = await fetch(`../api/fetch?site=${blog_link}`);;
        console.log(response);
      }
      // After all transcripts have been ingested, generate the datasource
      // const doctype = 'md'; // or 'txt', depending on what you want to send

      // await fetch('/api/generate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json', // Indicates that the body contains JSON
      //   },
      //   body: JSON.stringify({
      //     doctype: doctype, // Include the doctype in the request body
      //   }),
      // });
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
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
    <aside className="w-64 h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Resource Links</h2>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {link}
            </a>
          </li>
        ))}
      </ul>
      <div >
        <Input
          type="text"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder="Add new link"
          className="mt-4"
        />
        <Button className="flex h-10 w-full mt-2" onClick={handleAddLink}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>
      <Button className="flex h-10 w-full mt-2" onClick={ingestTranscripts} disabled={isLoading}>
        {isLoading ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          'Ingest Transcripts'
        )}
      </Button>
      <Button className="flex h-10 w-full mt-2" onClick={ingestBlog}>
        Ingest Blog
      </Button>
    </aside>
  );
};

export default SidePanel;
