import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, DollarSign, Settings, Zap, Search } from 'lucide-react';
import { useDataContext } from '../context/DataContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { querySuggestions } from '../lib/groq';

/**
 * Suggestion Page: Scans dashboard and uploaded CSV data to provide
 * actionable business improvement strategies.
 */
export function SuggestionPage() {
  const { fileContent } = useDataContext();
  const dashboardData = useDashboardData();
  const [loading, setLoading] = useState(true);
  const [suggestionsChunk, setSuggestionsChunk] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dashboardData.loading) return; // Wait until data structure resolves

    let mounted = true;
    
    // Auto-generate suggestions on mount
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      setSuggestionsChunk('');
      
      try {
        const fullContext = {
          metrics: dashboardData?.metrics || {},
          revenueData: dashboardData?.revenueData?.slice(-6) || [],
          fileContent: fileContent || null,
        };

        // We run the specialized CRO prompt
        await querySuggestions(fullContext, (chunk, accumulated) => {
          if (mounted) {
            setSuggestionsChunk(accumulated);
            // Once we start getting text, we can stop the overall "loading" spinner
            if (accumulated.length > 5) setLoading(false);
          }
        });
      } catch (err) {
        if (mounted) setError(err.message || "Failed to generate suggestions.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSuggestions();
    
    return () => { mounted = false; };
  }, [fileContent, dashboardData.loading]);

  // Parse the markdown string into sections robustly based on headings
  const sections = suggestionsChunk
    .split(/(?:\n\s*)+(?=## |\d\. |\*\*\d\. )/)
    .map(t => t.trim())
    .filter(t => t.length > 5);

  // Map icons and colors to the 4 specific themes we requested from the LLM
  const THEMES = [
    { icon: Search,       titleColor: 'text-blue-600',       bgColor: 'bg-blue-50',       iconColor: 'text-blue-500' },
    { icon: TrendingUp,   titleColor: 'text-primary-600',    bgColor: 'bg-primary-50',    iconColor: 'text-primary-500' },
    { icon: DollarSign,   titleColor: 'text-emerald-600',    bgColor: 'bg-emerald-50',    iconColor: 'text-emerald-500' },
    { icon: Settings,     titleColor: 'text-violet-600',     bgColor: 'bg-violet-50',     iconColor: 'text-violet-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          AI Business Suggestions
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
          Based on your {fileContent ? 'uploaded data file' : 'dashboard metrics'}, InsightAI acts as your fractional CRO, providing concrete steps to improve acquisition, cut costs, and convert better.
        </p>
      </div>

      {error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          {error}
        </div>
      ) : loading && !suggestionsChunk ? (
        // Initial Loading State
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm animate-skeleton-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-100 rounded-md w-1/4" />
                <div className="h-4 bg-slate-100 rounded-md w-full" />
                <div className="h-4 bg-slate-100 rounded-md w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Results Area
        <div className="space-y-6">
          {sections.map((sectionText, index) => {
            // Extract the title part and remove it from the body
            const theme = THEMES[index % 4];
            
            // Clean up common AI prefixes for titles like "## 1. Title:" or "**Title:**"
            const cleanText = sectionText.replace(/^(?:## |\d\. |\*\*\d\. \*\*|\*\*\d\. )/, '').replace(/^\*\*([^*]+)\*\*(?::)?\s*/, '').trim();
            
            // Fallback parsing just in case AI formatting drifts
            const title = index === 0 ? "Business Insights" : 
                          index === 1 ? "Customer Conversion Strategies" : 
                          index === 2 ? "Ad Spend Efficiency" : 
                          "Cost Reduction";
            
            const body = sectionText.replace(/^##\s.*?\n/, '').trim() || cleanText;

            return (
              <div 
                key={index}
                className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 relative overflow-hidden"
              >
                {/* Accent line on left */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${theme.bgColor.replace('50', '400')}`} />
                
                <div className="flex gap-5">
                  <div className={`w-12 h-12 rounded-xl ${theme.bgColor} flex items-center justify-center shrink-0`}>
                    <theme.icon className={`w-6 h-6 ${theme.iconColor}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${theme.titleColor} mb-2 flex items-center gap-2`}>
                      {title}
                      {loading && index === sections.length - 1 && (
                        <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                      )}
                    </h3>
                    <div className="text-slate-600 leading-relaxed text-sm space-y-2 mt-3">
                      {body.split('\n').filter(l => l.trim().length > 0).map((line, i) => {
                        const isBullet = /^[*-]\s/.test(line.trim());
                        const text = line.trim().replace(/^[*-]\s/, '');
                        
                        return isBullet ? (
                          <div key={i} className="flex gap-3 items-start">
                            <div className={`w-1.5 h-1.5 rounded-full ${theme.bgColor.replace('50', '400')} mt-1.5 shrink-0`} />
                            <span>{text}</span>
                          </div>
                        ) : (
                          <p key={i} className={i > 0 ? "mt-2" : ""}>{text}</p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SuggestionPage;
