import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export type PageSection = {
  sectionKey: string;
  head?: string;
  subHead?: string;
  caption?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
};

export type PageContent = {
  pageKey: string;
  title: string;
  sections: PageSection[];
};

export function usePageContent(pageKey: string) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await apiService.getPageContent(pageKey);
        if (isMounted && res && res.data) {
          setContent(res.data);
        }
      } catch (error) {
        console.error(`Failed to fetch content for ${pageKey}`, error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchContent();
    return () => { isMounted = false; };
  }, [pageKey]);

  /**
   * Helper to get section by key with fallback values
   */
  const getSection = (sectionKey: string, fallbacks: Partial<PageSection> = {}) => {
    const section = content?.sections.find(s => s.sectionKey === sectionKey);
    return {
      head: section?.head || fallbacks.head || "",
      subHead: section?.subHead || fallbacks.subHead || "",
      caption: section?.caption || fallbacks.caption || "",
      description: section?.description || fallbacks.description || "",
      buttonText: section?.buttonText || fallbacks.buttonText || "",
      buttonLink: section?.buttonLink || fallbacks.buttonLink || "",
      image: section?.image || fallbacks.image || "",
    };
  };

  return { content, loading, getSection };
}
