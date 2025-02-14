import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink, Coins, TrendingUp } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  creator?: string;
  categories: string[];
  media?: string;
  source: string;
}

interface NewsSource {
  url: string;
  name: string;
  type: 'finance' | 'crypto';
}

const NEWS_SOURCES: NewsSource[] = [
  // Fontes de notícias financeiras tradicionais
  { url: 'https://www.infomoney.com.br/feed/', name: 'InfoMoney', type: 'finance' },
  { url: 'https://br.investing.com/rss/news.rss', name: 'Investing.com', type: 'finance' },
  { url: 'https://www.seudinheiro.com/feed/', name: 'Seu Dinheiro', type: 'finance' },
  { url: 'https://www.suno.com.br/noticias/feed/', name: 'Suno', type: 'finance' },

  // Fontes de notícias de criptomoedas
  { url: 'https://www.criptofacil.com/feed/', name: 'Cripto Fácil', type: 'crypto' },
  { url: 'https://livecoins.com.br/feed/', name: 'LiveCoins', type: 'crypto' },
  { url: 'https://br.cointelegraph.com/rss', name: 'CoinTelegraph', type: 'crypto' },
  { url: 'https://br.beincrypto.com/feed/', name: 'BeInCrypto', type: 'crypto' },
  { url: 'https://portaldobitcoin.uol.com.br/feed/', name: 'Portal do Bitcoin', type: 'crypto' }
];

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsType, setNewsType] = useState<'finance' | 'crypto'>('finance');

  const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

  const parseXMLContent = (xmlContent: string, source: string): NewsItem[] => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      const items = xmlDoc.querySelectorAll('item');

      return Array.from(items).map((item): NewsItem => {
        const categoryElements = item.querySelectorAll('category');
        const categories = categoryElements 
          ? Array.from(categoryElements).map(cat => cat.textContent || '').filter(Boolean)
          : [];

        const mediaContent = item.querySelector('media\\:content, content');
        const mediaUrl = mediaContent?.getAttribute('url') || '';

        // Get the raw date string from the RSS feed
        const pubDateStr = item.querySelector('pubDate')?.textContent?.trim() || '';
        
        // Parse the date based on the source
        let pubDate = pubDateStr;
        try {
          const parsedDate = new Date(pubDateStr);
          
          // Handle specific sources that might need timezone adjustment
          const financeSources = ['InfoMoney', 'Investing.com', 'Seu Dinheiro', 'Suno'];
          if (financeSources.includes(source)) {
            // Adjust for Brazilian timezone (UTC-3)
            parsedDate.setHours(parsedDate.getHours() - 3);
          }
          
          pubDate = parsedDate.toISOString();
        } catch (err) {
          console.error('Error parsing date:', err, pubDateStr);
        }

        return {
          title: item.querySelector('title')?.textContent?.trim() || '',
          link: item.querySelector('link')?.textContent?.trim() || '',
          pubDate: pubDate,
          description: item.querySelector('description')?.textContent?.trim() || '',
          creator: item.querySelector('dc\\:creator')?.textContent?.trim() || '',
          categories: categories,
          media: mediaUrl,
          source: source
        };
      });
    } catch (err) {
      console.error('Error parsing XML:', err);
      return [];
    }
  };

  const fetchNewsFromSource = async (source: NewsSource) => {
    try {
      const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(source.url)}`);
      return parseXMLContent(response.data, source.name);
    } catch (err) {
      console.error(`Error fetching news from ${source.name}:`, err);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        setLoading(true);
        
        const selectedSources = NEWS_SOURCES.filter(source => source.type === newsType);
        const newsPromises = selectedSources.map(source => fetchNewsFromSource(source));
        const newsFromAllSources = await Promise.all(newsPromises);
        
        const combinedNews = newsFromAllSources
          .flat()
          .filter(item => item.title && item.link)
          .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

        if (combinedNews.length === 0) {
          throw new Error('Não foi possível carregar as notícias');
        }

        setNews(combinedNews);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar notícias. Tente novamente mais tarde.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
    const interval = setInterval(fetchAllNews, 300000);

    return () => clearInterval(interval);
  }, [newsType]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date);
    } catch (err) {
      console.error('Error formatting date:', err, dateString);
      return dateString;
    }
  };

  const cleanDescription = (description: string) => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = description;
      const text = tempDiv.textContent || tempDiv.innerText || '';
      return text.trim();
    } catch (err) {
      return description;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-navy-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-500/50 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-xs text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notícias
        </h3>
        <div className="flex w-full bg-gray-100 dark:bg-navy-700 rounded-lg p-1">
          <button
            onClick={() => setNewsType('finance')}
            className={`flex items-center justify-center flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors duration-200 ${
              newsType === 'finance'
                ? 'bg-white dark:bg-navy-600 text-cyan-600 dark:text-cyan-400'
                : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Mercado
          </button>
          <button
            onClick={() => setNewsType('crypto')}
            className={`flex items-center justify-center flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors duration-200 ${
              newsType === 'crypto'
                ? 'bg-white dark:bg-navy-600 text-cyan-600 dark:text-cyan-400'
                : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Coins className="w-3.5 h-3.5 mr-1" />
            Crypto
          </button>
        </div>
      </div>
      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {news.map((item, index) => (
          <div
            key={index}
            className="block p-3 bg-white dark:bg-navy-700 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-600 transition-colors duration-200 border border-gray-100 dark:border-navy-600"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-gray-900 dark:text-white text-sm font-medium mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-200 flex-1 line-clamp-2">
                  {item.title}
                </h4>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 ml-2 flex-shrink-0" />
              </div>
            </a>
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
              {cleanDescription(item.description)}
            </p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-600 dark:text-cyan-400 text-[10px]">
                  {formatDate(item.pubDate)}
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-[10px]">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">
                  {item.source}
                </span>
              </div>
              {item.categories && item.categories.length > 0 && (
                <span className="text-gray-500 dark:text-gray-400 text-[10px]">
                  {item.categories[0]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
