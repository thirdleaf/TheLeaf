export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: "Quant Research" | "Product Updates" | "Trading Psychology";
  author: string;
  readingTime: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "mastering-indian-options-with-greeks",
    title: "Mastering Indian Options: Understanding Greeks in NSE Markets",
    excerpt: "A deep dive into Delta, Gamma, Theta, and Vega for retail traders navigating the high volatility of NIFTY and BANKNIFTY.",
    date: "April 15, 2026",
    category: "Quant Research",
    author: "Arjun Mehta",
    readingTime: "8 min read",
    content: `
      ## The Volatility Edge
      Indian markets are unique due to their high retail participation and structural volatility. 
      In this guide, we explore how professional traders use Option Greeks to hedge their portfolios 
      and capture alpha in NSE derivatives...
      
      ### Delta: The Directional Sensitivity
      Delta measures how much an option price moves given a ₹1 change in the underlying index...
      
      ### Theta: The Time Decay
      For option sellers in India, Theta is the primary friend. With weekly expiries for BANKNIFTY, 
      time decay acceleration on Tuesdays and Wednesdays is a critical factor...
    `
  },
  {
    slug: "the-psychology-of-drawdown",
    title: "The Psychology of Drawdown: Staying Calm When the Curve Dips",
    excerpt: "Practical mental frameworks for professional traders to manage stress during mandatory recovery phases.",
    date: "April 08, 2026",
    category: "Trading Psychology",
    author: "Dr. Sarah Kapur",
    readingTime: "6 min read",
    content: `
      ## The Emotional Toll
      Drawdowns are inevitable. Every equity curve, no matter how smoothed, will experience dips. 
      The differentiator between a professional and an amateur is the ability to maintain 
      execution discipline during these periods...
    `
  },
  {
    slug: "announcing-dhan-integration",
    title: "System Update: Seamless DhanHQ API v2 Integration",
    excerpt: "We've overhauled our Dhan connector to support manual token management and instant session renewal.",
    date: "April 02, 2026",
    category: "Product Updates",
    author: "ThirdLeaf Team",
    readingTime: "4 min read",
    content: `
      ## Better Connectivity
      We are excited to announce full support for Dhan's official API v2. This includes 
      support for 24-hour persistent tokens and optimized websocket feeds for faster 
      journaling of intraday scalps...
    `
  }
];
