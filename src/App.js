import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  User,
  Briefcase,
  Award,
  TrendingUp,
  Download,
  Share2,
  Edit3,
  Plus,
  ChevronRight,
  Upload,
  Video,
  Music,
  FileText,
  Grid,
  Heart,
  Eye,
  Search,
  ExternalLink,
  Play,
  Compass,
  Target,
  Zap,
  ArrowRight,
  CheckCircle,
  Book,
  Users,
  BarChart3,
  Link2,
  Copy,
  Check,
  X,
  MessageSquare,
  Mail,
  Camera,
} from "lucide-react";

const SparkedIn = () => {
  const [step, setStep] = useState("welcome");
  const [phase, setPhase] = useState("discovery");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    tagline: "",
    about: "",
    spark: null,
    careerMatches: [],
    projects: [],
    media: [],
    skills: [],
    stats: { views: 0, likes: 0, followers: 0 },
    pathwayProgress: {
      discoveryComplete: false,
      portfolioStarted: false,
      firstUpload: false,
    },
    shareLink: null,
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [extractedData, setExtractedData] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [showMentorConnect, setShowMentorConnect] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const discoveryQuestions = [
    "Hi! I'm SparkedIn, and I'm here to help you discover your spark AND build an amazing portfolio. Let's start - what's your name?",
    "Great to meet you, {name}! Let's find your spark. Tell me - what do you do that makes you lose track of time? What gets you excited?",
    "Love it! Can you tell me about something you created, organized, or accomplished that you're proud of?",
    "That's impressive! When you imagine your dream career in entertainment - music, sports, media, content creation, behind the scenes - what draws you in?",
    "Perfect! What skills or talents do you think you have? Don't be modest - what are you naturally good at?",
  ];

  const careerDatabase = [
    {
      id: "music-producer",
      title: "Music Producer",
      category: "Music",
      description:
        "Create, arrange, and polish music tracks from concept to final product",
      dayInLife:
        "Work with artists in the studio, arrange beats, mix tracks, collaborate on sound",
      skills: [
        "Music Production",
        "Audio Engineering",
        "Creativity",
        "Technical Skills",
      ],
      portfolioNeeds: [
        "Beat tapes",
        "Production samples",
        "Collaborative tracks",
        "Before/after mixes",
      ],
      salary: "$45K-$120K",
      demand: "High",
      icon: "🎵",
      sparkMatch: [
        "music",
        "creating",
        "technical",
        "solo work",
        "beats",
        "producing",
      ],
    },
    {
      id: "content-creator",
      title: "Content Creator / Influencer",
      category: "Media",
      description:
        "Build an audience by creating engaging content across platforms",
      dayInLife:
        "Film videos, edit content, engage with audience, collaborate with brands",
      skills: [
        "Video Production",
        "Social Media",
        "Storytelling",
        "Personal Brand",
      ],
      portfolioNeeds: [
        "Video content",
        "Photography",
        "Engagement metrics",
        "Brand partnerships",
      ],
      salary: "$30K-$200K+",
      demand: "Very High",
      icon: "📱",
      sparkMatch: [
        "video",
        "social media",
        "performing",
        "audience",
        "content",
        "camera",
      ],
    },
    {
      id: "event-producer",
      title: "Event Producer",
      category: "Sports & Entertainment",
      description: "Plan and execute live events, concerts, and experiences",
      dayInLife:
        "Coordinate vendors, manage logistics, oversee event setup, handle crisis situations",
      skills: [
        "Project Management",
        "Leadership",
        "Problem Solving",
        "Coordination",
      ],
      portfolioNeeds: [
        "Event photos/videos",
        "Vendor contracts",
        "Budget sheets",
        "Testimonials",
      ],
      salary: "$40K-$95K",
      demand: "High",
      icon: "🎪",
      sparkMatch: [
        "organizing",
        "people",
        "logistics",
        "leadership",
        "events",
        "coordinating",
      ],
    },
    {
      id: "video-editor",
      title: "Video Editor",
      category: "Media",
      description: "Transform raw footage into compelling visual stories",
      dayInLife:
        "Review footage, cut sequences, add effects, color grade, export final videos",
      skills: [
        "Video Editing",
        "Storytelling",
        "Technical Skills",
        "Attention to Detail",
      ],
      portfolioNeeds: [
        "Editing samples",
        "Before/after reels",
        "Different styles",
        "Client work",
      ],
      salary: "$35K-$85K",
      demand: "Very High",
      icon: "🎬",
      sparkMatch: [
        "video",
        "storytelling",
        "detail-oriented",
        "technical",
        "editing",
        "filming",
      ],
    },
  ];

  const mentors = [
    {
      id: 1,
      name: "Sarah Williams",
      role: "Music Producer",
      company: "Atlantic Records",
      avatar: "🎵",
      expertise: "Music Production, Audio Engineering",
      available: true,
    },
    {
      id: 2,
      name: "Marcus Chen",
      role: "Content Creator",
      company: "2M+ Followers",
      avatar: "📱",
      expertise: "Social Media, Video Content",
      available: true,
    },
    {
      id: 3,
      name: "Jessica Torres",
      role: "Event Producer",
      company: "Live Nation",
      avatar: "🎪",
      expertise: "Event Planning, Production",
      available: false,
    },
    {
      id: 4,
      name: "David Rodriguez",
      role: "Creative Director",
      company: "Sony Music",
      avatar: "🎨",
      expertise: "Branding, Design",
      available: true,
    },
  ];

  useEffect(() => {
    if (step === "interview" && messages.length === 0) {
      setTimeout(() => addBotMessage(discoveryQuestions[0]), 500);
    }
  }, [step]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (userData.pathwayProgress.portfolioStarted && !userData.shareLink) {
      const link = `sparkedin.app/${
        userData.name?.toLowerCase().replace(/\s+/g, "-") || "user"
      }`;
      setUserData((prev) => ({ ...prev, shareLink: link }));
    }
  }, [userData.pathwayProgress.portfolioStarted]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text }]);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { type: "user", text }]);
  };

  const handleStartInterview = () => {
    setStep("interview");
    setPhase("discovery");
  };

  const matchCareers = (userData) => {
    const allText = extractedData
      .map((d) => d.text)
      .join(" ")
      .toLowerCase();

    const scoredCareers = careerDatabase.map((career) => {
      let score = 0;
      career.sparkMatch.forEach((keyword) => {
        if (allText.includes(keyword)) score += 1;
      });
      return { ...career, matchScore: Math.min(score, 5) };
    });

    return scoredCareers
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  };

  const extractSkillsFromText = (text) => {
    const skillKeywords = {
      video: ["Video Production", "Video Editing", "Cinematography"],
      music: ["Music Production", "Audio Engineering", "Composition"],
      designed: ["Graphic Design", "Visual Design", "UI/UX"],
      photo: ["Photography", "Photo Editing", "Visual Storytelling"],
      wrote: ["Writing", "Copywriting", "Content Creation"],
      performed: ["Performance", "Stage Presence", "Live Entertainment"],
      "social media": ["Social Media", "Content Strategy", "Digital Marketing"],
      organized: ["Event Planning", "Project Management", "Leadership"],
      managed: ["Management", "Coordination", "Team Leadership"],
      created: ["Creativity", "Innovation", "Problem Solving"],
    };

    const skills = new Set();
    const lowerText = text.toLowerCase();

    Object.keys(skillKeywords).forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        skillKeywords[keyword].forEach((skill) => skills.add(skill));
      }
    });

    return Array.from(skills);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    addUserMessage(userMessage);
    setInputValue("");

    if (currentQuestion === 0) {
      setUserData((prev) => ({ ...prev, name: userMessage }));
    }

    if (currentQuestion >= 1) {
      const skills = extractSkillsFromText(userMessage);
      setExtractedData((prev) => [...prev, { text: userMessage, skills }]);
    }

    if (currentQuestion < discoveryQuestions.length - 1) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      const nextQuestion = discoveryQuestions[nextQ].replace(
        "{name}",
        userData.name || "there"
      );
      addBotMessage(nextQuestion);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text:
              "This is amazing, " +
              (userData.name || "friend") +
              "! I can already see your spark ✨. Let me match you with some career paths that fit who you are...",
          },
        ]);
        setIsTyping(false);
        setTimeout(() => generateCareerMatches(), 2000);
      }, 1000);
    }
  };

  const generateCareerMatches = () => {
    setStep("generating");

    setTimeout(() => {
      const allSkills = new Set();
      extractedData.forEach((data) => {
        data.skills.forEach((skill) => allSkills.add(skill));
      });

      const matches = matchCareers(userData);

      setUserData((prev) => ({
        ...prev,
        spark: extractedData[0]?.text || "Creating and connecting",
        careerMatches: matches,
        skills: Array.from(allSkills),
        pathwayProgress: { ...prev.pathwayProgress, discoveryComplete: true },
      }));

      setTimeout(() => {
        setStep("career-results");
        setPhase("discovery");
      }, 2000);
    }, 3000);
  };

  const handleStartPortfolio = () => {
    setStep("generating");
    setTimeout(() => {
      const selectedCareerData = careerDatabase.find(
        (c) => c.id === selectedCareer
      );

      setUserData((prev) => ({
        ...prev,
        tagline: selectedCareerData
          ? `Aspiring ${selectedCareerData.title}`
          : "Creative Professional",
        about: `Passionate about ${
          selectedCareerData?.category || "entertainment"
        } with a drive to grow and learn. Currently building my portfolio and exploring opportunities in the industry. ${
          prev.spark ? "My spark: " + prev.spark : ""
        }`,
        media: [],
        stats: { views: 127, likes: 34, followers: 12 },
        pathwayProgress: { ...prev.pathwayProgress, portfolioStarted: true },
      }));

      setTimeout(() => {
        setStep("portfolio");
        setPhase("portfolio");
      }, 2000);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateAIDescription = async (filename, type) => {
    setIsGeneratingDescription(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const descriptions = {
      image: [
        "A vibrant capture showcasing my creative vision and attention to detail",
        "Visual storytelling that highlights my unique perspective and style",
        "Professional work demonstrating my technical skills and artistic eye",
      ],
      video: [
        "Dynamic video content that brings stories to life through creative editing",
        "A showcase of my video production and storytelling capabilities",
        "Engaging visual narrative demonstrating my technical and creative skills",
      ],
      audio: [
        "Original composition highlighting my musical creativity and technical production skills",
        "Audio production showcasing my understanding of sound design and mixing",
        "A demonstration of my ability to create compelling audio experiences",
      ],
    };

    const options = descriptions[type] || descriptions.image;
    const description = options[Math.floor(Math.random() * options.length)];

    setIsGeneratingDescription(false);
    return description;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const fileType = file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
          ? "video"
          : file.type.startsWith("audio")
          ? "audio"
          : "other";

        const aiDescription = await generateAIDescription(file.name, fileType);

        const newMedia = {
          id: Date.now(),
          type: fileType,
          title: file.name.split(".")[0].replace(/-|_/g, " "),
          description: aiDescription,
          url: reader.result,
          thumbnail: reader.result,
          likes: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 200),
          tags: userData.skills.slice(0, 3),
          isNew: true,
          uploadDate: new Date().toISOString(),
        };

        setUserData((prev) => ({
          ...prev,
          media: [newMedia, ...prev.media],
          stats: {
            views: prev.stats.views + Math.floor(Math.random() * 50),
            likes: prev.stats.likes + Math.floor(Math.random() * 20),
            followers: prev.stats.followers + Math.floor(Math.random() * 5),
          },
          pathwayProgress: { ...prev.pathwayProgress, firstUpload: true },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const items = [...userData.media];
    const draggedItemContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedItemContent);

    setUserData((prev) => ({ ...prev, media: items }));
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(userData.shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const MediaCard = ({ item, index }) => {
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
        className={`group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-move ${
          draggedItem === index ? "opacity-50" : ""
        }`}
      >
        <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
          {item.type === "image" && (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {item.type === "video" && (
            <div className="relative w-full h-full">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="bg-white/90 p-3 rounded-full">
                  <Play className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          )}
          {item.type === "audio" && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
              <Music className="w-16 h-16 text-white" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-2">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {item.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {item.likes}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white/20 hover:bg-white/30 p-1 rounded"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {item.isNew && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              New
            </div>
          )}
        </div>

        <div className="p-3" onClick={() => setSelectedMedia(item)}>
          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
              {item.description}
            </p>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const CareerCard = ({ career, isSelected }) => {
    return (
      <div
        onClick={() => setSelectedCareer(career.id)}
        className={`bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
          isSelected
            ? "ring-4 ring-purple-500 shadow-2xl scale-105"
            : "shadow-lg hover:shadow-xl hover:scale-102"
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl mb-2">{career.icon}</div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              career.demand === "Very High"
                ? "bg-green-100 text-green-700"
                : career.demand === "High"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {career.demand} Demand
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{career.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{career.description}</p>

        <div className="mb-4">
          <div className="text-xs font-semibold text-purple-600 mb-2">
            MATCH SCORE
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${
                  i <= career.matchScore ? "bg-purple-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1">
              Day in the Life:
            </div>
            <p className="text-xs text-gray-600">{career.dayInLife}</p>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1">
              Key Skills:
            </div>
            <div className="flex flex-wrap gap-1">
              {career.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1">
              Salary Range:
            </div>
            <p className="text-sm font-bold text-gray-800">{career.salary}</p>
          </div>
        </div>

        {isSelected && (
          <div className="mt-4 flex items-center gap-2 text-purple-600 font-semibold">
            <CheckCircle className="w-5 h-5" />
            <span>Selected - Ready to build portfolio!</span>
          </div>
        )}
      </div>
    );
  };

  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl relative">
              <svg
                className="w-20 h-20"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Lightbulb outline */}
                <path
                  d="M50 10 C35 10, 25 20, 25 35 C25 45, 30 52, 35 58 L35 70 C35 72, 37 75, 40 75 L60 75 C63 75, 65 72, 65 70 L65 58 C70 52, 75 45, 75 35 C75 20, 65 10, 50 10 Z"
                  stroke="white"
                  strokeWidth="3"
                  fill="white"
                  fillOpacity="0.2"
                />
                {/* Bulb base */}
                <rect
                  x="42"
                  y="75"
                  width="16"
                  height="8"
                  fill="white"
                  fillOpacity="0.3"
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Brain pattern inside bulb */}
                <g transform="translate(50, 42)">
                  {/* Left hemisphere curves */}
                  <path
                    d="M-8,-12 Q-12,-8 -10,-4 Q-12,0 -10,4 Q-12,8 -8,10"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.9"
                  />
                  <path
                    d="M-6,-10 Q-10,-6 -8,-2 Q-10,2 -8,6"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.7"
                  />
                  {/* Right hemisphere curves */}
                  <path
                    d="M8,-12 Q12,-8 10,-4 Q12,0 10,4 Q12,8 8,10"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.9"
                  />
                  <path
                    d="M6,-10 Q10,-6 8,-2 Q10,2 8,6"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.7"
                  />
                  {/* Center connection */}
                  <line
                    x1="-8"
                    y1="-12"
                    x2="8"
                    y2="-12"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <circle cx="0" cy="-8" r="2" fill="white" opacity="0.9" />
                  <circle cx="0" cy="0" r="1.5" fill="white" opacity="0.8" />
                  <circle cx="0" cy="6" r="1.5" fill="white" opacity="0.8" />
                </g>
                {/* Light rays */}
                <line
                  x1="50"
                  y1="5"
                  x2="50"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="70"
                  y1="15"
                  x2="75"
                  y2="10"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="30"
                  y1="15"
                  x2="25"
                  y2="10"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="80"
                  y1="35"
                  x2="85"
                  y2="35"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="20"
                  y1="35"
                  x2="15"
                  y2="35"
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-12 text-white">
            SparkedIn
          </h1>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              What ignites your creative spark?
            </h2>

            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    setUserData((prev) => ({ ...prev, name: inputValue }));
                    setExtractedData([
                      {
                        text: inputValue,
                        skills: extractSkillsFromText(inputValue),
                      },
                    ]);
                    handleStartInterview();
                  }
                }}
                placeholder="Tell me what you love to create..."
                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-full text-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={() => {
                  if (inputValue.trim()) {
                    setUserData((prev) => ({ ...prev, name: "Creative" }));
                    setExtractedData([
                      {
                        text: inputValue,
                        skills: extractSkillsFromText(inputValue),
                      },
                    ]);
                    handleStartInterview();
                  }
                }}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start
              </button>
            </div>
          </div>

          <p className="text-white/80 text-sm mt-6">
            From Usher's New Look • Discover your career, build your portfolio
          </p>
        </div>
      </div>
    );
  }

  if (step === "interview") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Discovery Phase</h2>
                  <p className="text-sm text-gray-500">Finding your spark...</p>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {discoveryQuestions.length}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestion + 1) / discoveryQuestions.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-5 py-3 rounded-2xl ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-white shadow-md text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white shadow-md px-5 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "generating") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl animate-pulse">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {phase === "discovery"
              ? "Finding Your Perfect Career Matches..."
              : "Creating Your Portfolio Space..."}
          </h2>
          <div className="space-y-3 text-left mb-6">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
              <span>Analyzing your unique spark</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div
                className="w-2 h-2 bg-pink-500 rounded-full animate-ping"
                style={{ animationDelay: "0.3s" }}
              ></div>
              <span>Matching you with careers</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div
                className="w-2 h-2 bg-orange-500 rounded-full animate-ping"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <span>Building your pathway</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse"
              style={{ width: "70%" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "career-results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl">SparkedIn</span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Discovery Complete</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">
                Your Spark Discovered!
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Hey {userData.name}! ✨
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Based on what you shared, here are your top entertainment career
              matches.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-12 text-white shadow-xl">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Zap className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Your Spark</h3>
                <p className="text-lg text-white/90 mb-4">"{userData.spark}"</p>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.slice(0, 6).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Your Career Matches
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Select the one that excites you most to build your portfolio
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {userData.careerMatches.map((career) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  isSelected={selectedCareer === career.id}
                />
              ))}
            </div>
          </div>

          {selectedCareer && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-purple-200">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Ready to Build Your Portfolio?
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Now that you've discovered your path as a{" "}
                    <span className="font-bold text-purple-600">
                      {
                        careerDatabase.find((c) => c.id === selectedCareer)
                          ?.title
                      }
                    </span>
                    , let's create a portfolio that showcases your potential.
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleStartPortfolio}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-full font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3 whitespace-nowrap"
                  >
                    Build My Portfolio
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {!selectedCareer && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-yellow-100 px-6 py-3 rounded-full">
                <Target className="w-5 h-5 text-yellow-700" />
                <span className="font-semibold text-yellow-800">
                  Select a career above to continue
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "portfolio") {
    return (
      <div className="min-h-screen bg-gray-50">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">SparkedIn</span>
              </div>
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </nav>

        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
            <div className="flex flex-col items-center text-center text-white">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden mb-4">
                <div className="w-full h-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">{userData.name}</h1>
              <p className="text-xl text-white/90 mb-4">{userData.tagline}</p>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userData.stats.views}
                  </div>
                  <div className="text-sm text-white/80">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userData.stats.likes}
                  </div>
                  <div className="text-sm text-white/80">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userData.stats.followers}
                  </div>
                  <div className="text-sm text-white/80">Followers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-600" />
              Upload Your Work
            </h2>

            {!userData.pathwayProgress.firstUpload && (
              <div className="bg-purple-50 rounded-lg p-4 mb-4 border-2 border-purple-200">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-purple-900 mb-1">
                      Start building your portfolio!
                    </div>
                    <p className="text-sm text-purple-800">
                      Upload your first piece of work. AI will help you write
                      professional descriptions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-dashed border-purple-300 rounded-lg p-6 hover:border-purple-500 hover:shadow-md transition-all text-center"
              >
                <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-purple-600">
                  Image
                </span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-dashed border-pink-300 rounded-lg p-6 hover:border-pink-500 hover:shadow-md transition-all text-center"
              >
                <Video className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-pink-600">Video</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-dashed border-orange-300 rounded-lg p-6 hover:border-orange-500 hover:shadow-md transition-all text-center"
              >
                <Music className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-orange-600">
                  Audio
                </span>
              </button>
              <button className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all text-center">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-blue-600">
                  Writing
                </span>
              </button>
            </div>
          </div>

          {userData.media.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Grid className="w-6 h-6 text-purple-600" />
                My Work ({userData.media.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userData.media.map((item, index) => (
                  <MediaCard key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">
                No work uploaded yet
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Start building your portfolio by uploading your first piece
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Upload First Work
              </button>
            </div>
          )}
        </div>

        {showShareModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Share Your Portfolio
                </h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Your Portfolio Link
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
                  <Link2 className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={userData.shareLink || "sparkedin.app/yourname"}
                    readOnly
                    className="flex-1 bg-transparent outline-none text-gray-800"
                  />
                  <button
                    onClick={copyShareLink}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {linkCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {linkCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMedia && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedMedia.title}
                    </h2>
                    <p className="text-gray-600">{selectedMedia.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-4">
                  {selectedMedia.type === "image" && (
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.title}
                      className="w-full rounded-lg"
                    />
                  )}
                  {selectedMedia.type === "video" && (
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  )}
                  {selectedMedia.type === "audio" && (
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-12 flex flex-col items-center justify-center">
                      <Music className="w-24 h-24 text-white mb-4" />
                      <div className="text-white text-lg font-semibold">
                        {selectedMedia.title}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">{selectedMedia.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">{selectedMedia.views}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Building your experience...
        </h2>
        <p className="text-gray-600">Current step: {step}</p>
        <button
          onClick={() => setStep("welcome")}
          className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full"
        >
          Back to Start
        </button>
      </div>
    </div>
  );
};

export default SparkedIn;
