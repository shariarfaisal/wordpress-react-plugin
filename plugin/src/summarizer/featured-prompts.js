import Truncate from "./truncate";
import { useMemo, useState } from "react";
import { useSummarizer } from "./useSummarizer";
import { CiTextAlignLeft } from "react-icons/ci";

export default function FeaturedPrompts({ isTitleExists }) {
  const { setLimitOpen } = useSummarizer();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Content Creation");

  const createPrompt = () => {
    setLimitOpen(true);
  };

  const results = useMemo(() => {
    const items = [
      {
        id: 6,
        title: "Movie Review",
        category: "Entertainment",
        prompt:
          "Your task is to write a compelling movie review that informs and entertains readers while offering insightful analysis and commentary. Start by summarizing the plot of the movie, from the video. Share your overall impression of the movie, including your thoughts on the storyline and characters. Offer specific examples and anecdotes to support your opinions and provide evidence for your analysis. Discuss the movie's strengths and weaknesses, highlighting what worked well and what could have been improved. Finally, conclude your review with a thoughtful reflection or recommendation, summarizing your key points and offering your final verdict on whether the movie is worth watching. ",
        featured: 0,
        type: "TubeOnAI",
        created_at: "2024-05-09T09:56:00.000000Z",
        updated_at: "2024-06-24T15:24:05.000000Z",
        slug: "movie-review",
      },
      {
        id: 22,
        title: "Social Media Posts Generator",
        category: "Content Creation",
        prompt:
          "Based on the content of the provided video/podcast/article, create engaging social media posts for Facebook, Instagram, and Twitter by extracting key quotes, statistics, or insights and crafting platform-specific content and captions.\n\nFacebook:\n\nExtract compelling quotes, statistics, or insights from the content to create a post that sparks curiosity and encourages engagement.\nCraft a caption that provides context for the quote/statistic/insight and invites users to learn more by watching/listening to the full content.\n\nInstagram:\n\nSelect appealing quotes, statistics, or insights that can be showcased effectively in an Instagram post format.\nCraft concise and engaging captions using relevant hashtags to increase discoverability and reach.\n\nTwitter:\n\nExtract concise quotes, statistics, or insights that fit within Twitter's character limit while still capturing attention and generating interest.\nCraft punchy and engaging tweets that convey the essence of the content and encourage users to click on the provided link to access the full content.\nUse relevant hashtags and mentions to increase visibility and engagement, and consider leveraging Twitter's multimedia features such as images or GIFs to enhance the tweet's appeal.\n\nOverall, aim to create social media posts that leverage the most compelling aspects of the content to captivate and engage audiences across different platforms, while tailoring the content and messaging to suit the unique characteristics and preferences of each platform.",
        featured: 1,
        type: "TubeOnAI",
        created_at: "2024-05-09T10:00:35.000000Z",
        updated_at: "2024-06-24T15:24:28.000000Z",
        slug: "social-media-posts-generator",
      },
      {
        id: 27,
        title: "Email Newsletter Writer",
        category: "Content Creation",
        prompt:
          "As a content creator, you want to repurpose the insights and information from a YouTube video into a compelling email newsletter for your subscribers. Your goal is to distill the main points and key takeaways from the video into a concise and engaging newsletter that resonates with your audience. Write an email newsletter based on the content of the provided YouTube video, focusing on delivering valuable insights, updates, or announcements to your subscribers. Tailor the newsletter to match your brand voice and communication style, ensuring clarity and coherence in your messaging. Use persuasive language, catchy subject lines, and compelling visuals to grab the reader's attention and encourage them to take action. Provide links to the original video or additional resources for further exploration, and conclude with a clear call-to-action to drive engagement and conversions",
        featured: 0,
        type: "TubeOnAI",
        created_at: "2024-05-09T10:02:17.000000Z",
        updated_at: "2024-07-02T11:59:57.000000Z",
        slug: "email-newsletter-writer",
      },
      {
        id: 39,
        title: "Stock Analysis Report",
        category: "Content Creation",
        prompt:
          "You are a stock market analyst preparing a detailed report on specific stocks discussed in a YouTube video. Write a report of approximately 700-800 words that includes a summary of recent quarterly earnings, key financial ratios, and any significant news or events affecting the companies. Provide an analysis of the stock's price movement and valuation metrics. Include expert opinions and insights shared in the video, and offer your own perspective on whether the stock is a good buy, hold, or sell. Ensure your report is thorough, well-structured, and provides actionable insights for investors.",
        featured: 0,
        type: "Community Request",
        created_at: "2024-05-19T17:21:40.000000Z",
        updated_at: "2024-06-24T15:28:36.000000Z",
        slug: "stock-analysis-report",
      },
      {
        id: 25,
        title: "Podcast Script Writer",
        category: "Content Creation",
        prompt:
          "As a podcaster, you aim to repurpose the content of a YouTube video into an engaging audio script for your podcast episode. Your goal is to transform the key insights and narratives from the video into a compelling script that captivates your audience and maintains their interest throughout the episode. Write a podcast script based on the content of the provided YouTube video, ensuring a smooth flow of information and seamless transitions between topics. Incorporate storytelling elements, compelling anecdotes, and relevant examples to enrich the listener experience and convey the main ideas effectively. Tailor the script to fit the tone, style, and format of your podcast, keeping your target audience in mind. Aim to deliver valuable insights and actionable takeaways that leave a lasting impression on your listeners.",
        featured: 0,
        type: "TubeOnAI",
        created_at: "2024-05-09T10:01:25.000000Z",
        updated_at: "2024-06-28T17:41:04.000000Z",
        slug: "podcast-script-writer",
      },
      {
        id: 43,
        title: "Twitter Thread Generator",
        category: "Content Creation",
        prompt:
          "As an expert social media manager, your task is to generate an engaging and impactful tweet thread based on the topic of the post. Begin by analyzing the key message, main points, and intended audience of the tweets. Craft an attention-grabbing tweet thread that discusses the topics of the content. Use language that is clear, compelling, and relevant to the topic, while also incorporating elements of creativity and originality to stand out in the Twitter feed. Include relevant hashtags to enhance visibility and reach on the platform. ",
        featured: 1,
        type: "TubeOnAI",
        created_at: "2024-05-29T16:44:37.000000Z",
        updated_at: "2024-06-28T17:41:36.000000Z",
        slug: "twitter-thread-generator",
      },
      {
        id: 43,
        title: "Twitter Thread Generator",
        category: "Content Creation",
        prompt:
          "As an expert social media manager, your task is to generate an engaging and impactful tweet thread based on the topic of the post. Begin by analyzing the key message, main points, and intended audience of the tweets. Craft an attention-grabbing tweet thread that discusses the topics of the content. Use language that is clear, compelling, and relevant to the topic, while also incorporating elements of creativity and originality to stand out in the Twitter feed. Include relevant hashtags to enhance visibility and reach on the platform. ",
        featured: 1,
        type: "TubeOnAI",
        created_at: "2024-05-29T16:44:37.000000Z",
        updated_at: "2024-06-28T17:41:36.000000Z",
        slug: "twitter-thread-generator",
      },
      {
        id: 37,
        title: "Quizzes or Assessments",
        category: "Educational",
        prompt:
          "Based on the content of the provided video or article, design targeted quizzes or assessments that challenge viewers/readers to recall and apply what they have learned, testing comprehension and the ability to apply knowledge in new contexts.\n\nYour task is to create a series of quiz questions or assessment activities that cover key concepts, theories, or information presented in the video or article. These assessments should be designed to engage viewers/readers and encourage active learning by prompting them to recall specific details, analyze information, and apply their understanding in different scenarios.\n\nEnsure that the quiz questions or assessment activities are clear, concise, and aligned with the learning objectives of the video or article. Consider incorporating a variety of question formats, such as multiple-choice, true/false, short answer, or scenario-based questions, to assess different aspects of comprehension and application.\n\nAdditionally, provide feedback or explanations for each question to reinforce learning and clarify any misconceptions. Encourage viewers/readers to reflect on their responses and identify areas where they may need further review or clarification.",
        featured: 1,
        type: "TubeOnAI",
        created_at: "2024-05-09T10:05:13.000000Z",
        updated_at: "2024-06-28T17:41:14.000000Z",
        slug: "quizzes-or-assessments",
      },
    ];

    return items;
  }, []);

  const categories = [
    "Entertainment",
    "Marketing",
    "Technical",
    "Content Creation",
    "Educational",
  ];

  return (
    <>
      <div className="w-full flex items-center justify-between gap-3">
        <input
          type="text"
          className="w-[200px] h-9 rounded-lg outline-none border focus:outline-none border-gray-300 px-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍Search"
          size="large"
        />
        <select
          className="w-[180px] cursor-pointer h-9 rounded-lg outline-none border focus:outline-none border-gray-300 px-3"
          placeholder="Category"
          value={activeCategory}
          onChange={(e) => {
            setActiveCategory(e.target.value);
            setLimitOpen(true);
          }}
        >
          {categories.map((category) => {
            return (
              <option key={category} value={category}>
                {category}
              </option>
            );
          })}
        </select>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((prompt) => {
          const exists = isTitleExists?.(prompt.title);

          return (
            <div
              key={prompt.id}
              onClick={(e) => {
                const target = e.target;
                if (target.getAttribute("data-more") === "true") {
                  return;
                }

                createPrompt();
              }}
              className={`p-3 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-900  transition-all duration-200 ease-in-out ${
                exists ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-base font-semibold truncate max-h-[calc(100%-150px)]">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-black">
                    <CiTextAlignLeft className="text-lg" />
                  </span>
                  <span className="text-lg">
                    {prompt.title} {!!prompt.featured && "🔥"}
                  </span>
                  {exists && <Tag color="gold">Exists</Tag>}
                </div>
              </div>
              <p className="text-sm font-normal tracking-wide">
                <Truncate
                  text={prompt.prompt}
                  limit={200}
                  className="text-xs hover:font-medium"
                />
              </p>
            </div>
          );
        })}
      </div>
      {!results.length && (
        <div>
          <p className="text-lg font-medium text-gray-500">No results found</p>
        </div>
      )}
    </>
  );
}
