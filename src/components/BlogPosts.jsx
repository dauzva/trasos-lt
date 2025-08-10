// src/components/BlogPosts.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

function BlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would fetch from your database
      // For now, we'll simulate with localStorage
      const storedPosts = localStorage.getItem('blogPosts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Nepavyko užkrauti įrašų');
    } finally {
      setLoading(false);
    }
  };

  const generateNewPost = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await fetch('/.netlify/functions/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Nepavyko sugeneruoti įrašo');
      }

      const data = await response.json();
      
      if (data.success) {
        // Parse the markdown content to extract title
        const lines = data.content.split('\n');
        const titleLine = lines.find(line => line.startsWith('#'));
        const title = titleLine ? titleLine.replace(/^#+\s*/, '') : 'Naujas įrašas';
        
        const newPost = {
          id: data.postId,
          title: title,
          content: data.content,
          timestamp: new Date().toISOString(),
          author: 'AI Generatorius'
        };

        // Store in localStorage (in real app, this would be saved to database)
        const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const updatedPosts = [newPost, ...existingPosts];
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
        
        setPosts(updatedPosts);
      }
    } catch (error) {
      console.error('Error generating post:', error);
      setError('Nepavyko sugeneruoti naujo įrašo');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMarkdown = (content) => {
    // Simple markdown to HTML conversion for display
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');
  };

  // Helper to convert Lithuanian characters to ASCII
  const ltToAscii = (str) => str
    .replace(/ą/g, 'a')
    .replace(/č/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ė/g, 'e')
    .replace(/į/g, 'i')
    .replace(/š/g, 's')
    .replace(/ų/g, 'u')
    .replace(/ū/g, 'u')
    .replace(/ž/g, 'z')
    .replace(/Ą/g, 'A')
    .replace(/Č/g, 'C')
    .replace(/Ę/g, 'E')
    .replace(/Ė/g, 'E')
    .replace(/Į/g, 'I')
    .replace(/Š/g, 'S')
    .replace(/Ų/g, 'U')
    .replace(/Ū/g, 'U')
    .replace(/Ž/g, 'Z');

  const kebabTitle = (title) =>
    ltToAscii(title)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2 text-gray-600">Kraunami įrašai...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Automatiniai blog įrašai</h1>
          <p className="text-gray-600">AI generuojami straipsniai apie žemės ūkį ir technologijas</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchPosts}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atnaujinti
          </Button>
          <Button
            onClick={generateNewPost}
            disabled={generating}
            className="bg-green-600 hover:bg-green-700"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generuojama...
              </>
            ) : (
              'Generuoti naują įrašą'
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nėra sugeneruotų įrašų</p>
          <Button
            onClick={generateNewPost}
            disabled={generating}
            className="bg-green-600 hover:bg-green-700"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generuojama...
              </>
            ) : (
              'Generuoti pirmą įrašą'
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const kebab = kebabTitle(post.title);
            return (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    <Link to={`/post/${kebab}`} className="hover:underline text-green-700">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BlogPosts;
