import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { articles } from "@/constants/strings";

const BlogPost = () => {
  const { slug } = useParams();
  const article = articles.find(article => article.slug === slug);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/30 to-accent/10">
      <Helmet>
        <title>{article.title} - SousChef AI</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <NavigationBar />
      
      <main className="container mx-auto px-4 py-12">
        <article className="prose prose-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <span>{article.readTime}</span>
            <span>•</span>
            <span>{article.category}</span>
          </div>

          <div className="space-y-6 text-gray-700">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;