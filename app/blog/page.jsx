import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from 'lucide-react';

const blogPosts = [
  {
    title: "Advancements in Object Detection AI",
    excerpt: "Explore the latest breakthroughs in object detection algorithms and their real-world applications.",
    date: "2023-11-15",
    slug: ""
  },
  {
    title: "The Future of AI in Web Applications",
    excerpt: "Discover how AI is reshaping the landscape of web development and user experiences.",
    date: "2023-11-10",
    slug: ""
  },
  {
    title: "Ethical Considerations in AI Development",
    excerpt: "A deep dive into the ethical challenges and responsibilities in AI research and implementation.",
    date: "2023-11-05",
    slug: ""
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <nav className="bg-black bg-opacity-50 backdrop-blur-lg sticky top-0 z-10 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <BrainCircuit className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                AI-Storm
              </span>
            </Link>
            <h1 className="text-xl font-bold text-zinc-100">Blog</h1>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Latest Articles
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Card key={index} className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-zinc-100">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">{post.excerpt}</p>
                <p className="text-sm text-zinc-500 mt-2">{post.date}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/blog/${post.slug}`} passHref>
                  <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-100">
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-zinc-800 mt-16 py-8 border-t border-zinc-700">
        <div className="container mx-auto px-4 text-center text-zinc-400">
          <p>&copy; {new Date().getFullYear()} AI-Storm. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
