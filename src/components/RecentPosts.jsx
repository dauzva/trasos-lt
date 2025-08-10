// src/components/RecentPosts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, RefreshCw } from 'lucide-react';
import { getCategoryFromMapping } from '../data/category-mapping';
import { postsApi } from '../lib/neon';

function RecentPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from Neon DB first
      try {
        const { posts: neonPosts } = await postsApi.getRecentPosts(3);
        setPosts(neonPosts);
        return;
      } catch (neonError) {
        console.log('Neon DB not available, trying Netlify functions...');
      }
      
      // Fallback to Netlify functions
      const response = await fetch('/.netlify/functions/get-posts?limit=3');
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
      } else {
        console.error('Error fetching posts:', data.error);
        // Final fallback to localStorage for development
        const storedPosts = localStorage.getItem('blogPosts');
        if (storedPosts) {
          const allPosts = JSON.parse(storedPosts);
          setPosts(allPosts.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      // Final fallback to localStorage for development
      const storedPosts = localStorage.getItem('blogPosts');
      if (storedPosts) {
        const allPosts = JSON.parse(storedPosts);
        setPosts(allPosts.slice(0, 3));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    // Remove markdown formatting for preview
    const plainText = content
      .replace(/^#+\s*/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .trim();
    
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  const getCategoryDisplay = (categoryKey) => {
    const categoryInfo = getCategoryFromMapping(categoryKey);
    return categoryInfo ? categoryInfo.displayName : 'Bendras';
  };

  const generateNewPost = async () => {
    try {
      setGenerating(true);
      const response = await fetch('/.netlify/functions/generate-blog', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        // Refresh the posts list
        await fetchRecentPosts();
      } else {
        console.error('Error generating post:', data.error);
        // Fallback for development - save to localStorage
        if (data.post) {
          const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
          const updatedPosts = [data.post, ...existingPosts];
          localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
          setPosts(updatedPosts.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Error generating post:', error);
    } finally {
      setGenerating(false);
    }
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

  // Helper to convert title to kebab-case
  const kebabTitle = (title) =>
    ltToAscii(title)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-green-600 mr-2" />
          <span className="text-gray-600">Kraunami straipsniai...</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Naujausi straipsniai</h3>
          <button 
            onClick={generateNewPost}
            disabled={generating}
            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 text-sm disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generuojama...
              </>
            ) : (
              <>
                Generuoti straipsni
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Straipsniai generuojami automatiskai kas 6 valandas.</p>
          <p className="text-sm mt-2">Arba spauskite mygtuką auksciau, kad sugeneruotumete dabar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Naujausi straipsniai</h3>
        <div className="flex gap-2">
          <button 
            onClick={fetchRecentPosts}
            disabled={loading}
            className="text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atnaujinti
          </button>
          <button 
            onClick={generateNewPost}
            disabled={generating}
            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 text-sm disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generuojama...
              </>
            ) : (
              <>
                Generuoti nauja
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  AI straipsnis
                </Badge>
                {post.category && (
                  <Badge variant="outline" className="text-xs">
                    {getCategoryDisplay(post.category)}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg leading-tight line-clamp-2">
                {post.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.author}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {post.excerpt || truncateContent(post.content)}
              </p>
              <Link
                to={`/post/${kebabTitle(post.title)}`}
                className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
              >
                Skaityti daugiau
                <ArrowRight size={14} />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default RecentPosts;
