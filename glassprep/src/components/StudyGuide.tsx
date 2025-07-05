import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, TrendingUp, Target, BarChart, Globe, Smartphone } from 'lucide-react';

interface StudySection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  topics: StudyTopic[];
}

interface StudyTopic {
  title: string;
  keyPoints: string[];
  practiceQuestions: string[];
  resources: string[];
}

const studySections: StudySection[] = [
  {
    id: 'strategy',
    title: 'Marketing Strategy & Planning',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    topics: [
      {
        title: 'Go-to-Market Strategy',
        keyPoints: [
          'Market analysis and competitive positioning',
          'Target audience identification and personas',
          'Value proposition development',
          'Channel strategy and distribution',
          'Pricing strategy and positioning',
          'Launch timeline and milestones'
        ],
        practiceQuestions: [
          'How would you develop a GTM strategy for a new SaaS product?',
          'What factors influence pricing strategy in B2B vs B2C markets?',
          'How do you prioritize marketing channels for limited budget?'
        ],
        resources: [
          'Product Marketing Alliance GTM Framework',
          'First Round Review: GTM Strategy',
          'HubSpot GTM Templates'
        ]
      },
      {
        title: 'Customer Segmentation & Targeting',
        keyPoints: [
          'Demographic, psychographic, behavioral segmentation',
          'Jobs-to-be-Done framework',
          'Customer journey mapping',
          'Persona development and validation',
          'Segment prioritization and selection',
          'Personalization strategies'
        ],
        practiceQuestions: [
          'How would you segment customers for a marketplace platform?',
          'What data would you use to validate customer personas?',
          'How do you balance broad reach vs. targeted messaging?'
        ],
        resources: [
          'Clayton Christensen: Jobs to be Done',
          'Customer Journey Mapping Guide',
          'Segment.com Customer Data Platform'
        ]
      }
    ]
  },
  {
    id: 'digital',
    title: 'Digital Marketing Channels',
    icon: Globe,
    color: 'from-green-500 to-emerald-500',
    topics: [
      {
        title: 'Paid Search & PPC',
        keyPoints: [
          'Google Ads campaign structure and optimization',
          'Keyword research and match types',
          'Bidding strategies and budget allocation',
          'Quality Score factors and improvement',
          'Landing page optimization for PPC',
          'Microsoft Ads and alternative platforms'
        ],
        practiceQuestions: [
          'How would you structure a Google Ads account for an e-commerce client?',
          'What factors would you consider when setting bid strategies?',
          'How do you optimize for Quality Score improvements?'
        ],
        resources: [
          'Google Ads Certification',
          'WordStream PPC Guide',
          'Search Engine Land PPC Articles'
        ]
      },
      {
        title: 'Social Media Marketing',
        keyPoints: [
          'Platform-specific content strategies',
          'Organic vs. paid social media',
          'Community management and engagement',
          'Influencer marketing and partnerships',
          'Social commerce and shopping features',
          'Crisis management and reputation'
        ],
        practiceQuestions: [
          'How would you develop a content strategy for B2B LinkedIn?',
          'What metrics would you track for influencer campaigns?',
          'How do you handle negative feedback on social media?'
        ],
        resources: [
          'Social Media Examiner Reports',
          'Sprout Social Insights',
          'Later Social Media Guides'
        ]
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Measurement',
    icon: BarChart,
    color: 'from-purple-500 to-pink-500',
    topics: [
      {
        title: 'Marketing Attribution',
        keyPoints: [
          'Multi-touch attribution models',
          'First-party data collection strategies',
          'Cross-device and cross-platform tracking',
          'Incrementality testing and measurement',
          'Marketing mix modeling (MMM)',
          'Customer lifetime value calculation'
        ],
        practiceQuestions: [
          'How would you measure the true impact of upper-funnel campaigns?',
          'What attribution model would you recommend for a long sales cycle?',
          'How do you account for offline conversions in digital attribution?'
        ],
        resources: [
          'Google Analytics 4 Documentation',
          'Marketing Attribution Guide by Segment',
          'Incrementality Testing Best Practices'
        ]
      },
      {
        title: 'Performance Optimization',
        keyPoints: [
          'A/B testing methodology and statistical significance',
          'Conversion rate optimization (CRO)',
          'Customer acquisition cost (CAC) optimization',
          'Return on ad spend (ROAS) improvement',
          'Cohort analysis and retention metrics',
          'Revenue attribution and forecasting'
        ],
        practiceQuestions: [
          'How would you design an A/B test for email subject lines?',
          'What would you do if CAC is increasing while LTV remains flat?',
          'How do you prioritize CRO experiments with limited resources?'
        ],
        resources: [
          'Optimizely Testing Guide',
          'ConversionXL CRO Playbook',
          'VWO A/B Testing Resources'
        ]
      }
    ]
  },
  {
    id: 'growth',
    title: 'Growth Marketing',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    topics: [
      {
        title: 'Growth Hacking & Experimentation',
        keyPoints: [
          'Growth framework and hypothesis development',
          'Rapid experimentation and iteration',
          'Product-led growth strategies',
          'Viral marketing and referral programs',
          'Retention and engagement optimization',
          'North Star metrics and KPI alignment'
        ],
        practiceQuestions: [
          'How would you identify growth levers for a freemium SaaS product?',
          'What experiments would you run to improve user activation?',
          'How do you balance growth speed with sustainable practices?'
        ],
        resources: [
          'Reforge Growth Series',
          'Growth Hackers Community',
          'Sean Ellis Growth Hacking Guide'
        ]
      },
      {
        title: 'Customer Retention & Loyalty',
        keyPoints: [
          'Churn prediction and prevention',
          'Customer success and onboarding',
          'Loyalty programs and rewards',
          'Win-back campaigns and re-engagement',
          'Customer advocacy and referrals',
          'Lifetime value optimization'
        ],
        practiceQuestions: [
          'How would you reduce churn for a subscription service?',
          'What metrics would you track for customer success?',
          'How do you design an effective referral program?'
        ],
        resources: [
          'Customer Success Collective',
          'ChurnZero Retention Guide',
          'Mention Me Referral Insights'
        ]
      }
    ]
  },
  {
    id: 'emerging',
    title: 'Emerging Trends & Technologies',
    icon: Smartphone,
    color: 'from-indigo-500 to-purple-500',
    topics: [
      {
        title: 'AI & Marketing Automation',
        keyPoints: [
          'AI-powered personalization and recommendations',
          'Chatbots and conversational marketing',
          'Predictive analytics and machine learning',
          'Marketing automation workflows',
          'Dynamic content optimization',
          'Voice search and smart assistants'
        ],
        practiceQuestions: [
          'How would you implement AI personalization for an e-commerce site?',
          'What use cases exist for chatbots in B2B marketing?',
          'How do you optimize content for voice search?'
        ],
        resources: [
          'Marketing AI Institute',
          'Salesforce Marketing Cloud AI',
          'Google AI for Marketing'
        ]
      },
      {
        title: 'Privacy & Compliance',
        keyPoints: [
          'GDPR, CCPA, and privacy regulations',
          'First-party data strategies',
          'Consent management and transparency',
          'Cookieless tracking solutions',
          'Data governance and security',
          'Ethical marketing practices'
        ],
        practiceQuestions: [
          'How would you adapt marketing strategy for a cookieless future?',
          'What consent management strategy would you implement?',
          'How do you balance personalization with privacy concerns?'
        ],
        resources: [
          'IAB Privacy & Consent Framework',
          'OneTrust Privacy Resources',
          'Future of Privacy Forum'
        ]
      }
    ]
  }
];

export const StudyGuide: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Digital Marketing Study Guide
        </h1>
        <p className="text-xl text-gray-300">
          Comprehensive preparation for your marketing interview
        </p>
      </div>

      <div className="space-y-6">
        {studySections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.id);

          return (
            <div key={section.id} className="glass-card overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors bg-gradient-to-r ${section.color} bg-opacity-10`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-white" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-white" />
                )}
              </button>

              {isExpanded && (
                <div className="p-6 pt-0">
                  <div className="space-y-4">
                    {section.topics.map((topic, topicIndex) => {
                      const topicId = `${section.id}-${topicIndex}`;
                      const isTopicExpanded = expandedTopics.has(topicId);

                      return (
                        <div key={topicIndex} className="border border-white/10 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleTopic(topicId)}
                            className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                          >
                            <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                            {isTopicExpanded ? (
                              <ChevronUp className="w-5 h-5 text-white" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-white" />
                            )}
                          </button>

                          {isTopicExpanded && (
                            <div className="p-4 pt-0 space-y-6">
                              {/* Key Points */}
                              <div>
                                <h4 className="text-md font-semibold text-purple-300 mb-3">Key Points to Master:</h4>
                                <ul className="space-y-2">
                                  {topic.keyPoints.map((point, pointIndex) => (
                                    <li key={pointIndex} className="flex items-start gap-2 text-gray-300">
                                      <span className="text-purple-400 mt-1">•</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Practice Questions */}
                              <div>
                                <h4 className="text-md font-semibold text-blue-300 mb-3">Practice Questions:</h4>
                                <ul className="space-y-2">
                                  {topic.practiceQuestions.map((question, questionIndex) => (
                                    <li key={questionIndex} className="flex items-start gap-2 text-gray-300">
                                      <span className="text-blue-400 mt-1">?</span>
                                      <span className="italic">{question}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Resources */}
                              <div>
                                <h4 className="text-md font-semibold text-green-300 mb-3">Recommended Resources:</h4>
                                <ul className="space-y-2">
                                  {topic.resources.map((resource, resourceIndex) => (
                                    <li key={resourceIndex} className="flex items-start gap-2 text-gray-300">
                                      <span className="text-green-400 mt-1">📚</span>
                                      <span>{resource}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interview Tips */}
      <div className="glass-card p-6 mt-8">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          Interview Success Tips
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-3">Before the Interview:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Research the company's marketing challenges and opportunities</li>
              <li>• Prepare specific examples using the STAR method</li>
              <li>• Review recent marketing campaigns and industry trends</li>
              <li>• Practice explaining complex concepts simply</li>
              <li>• Prepare thoughtful questions about the role and team</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-3">During the Interview:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Structure your answers with clear frameworks</li>
              <li>• Use data and metrics to support your points</li>
              <li>• Ask clarifying questions for case study problems</li>
              <li>• Show your thought process, not just final answers</li>
              <li>• Demonstrate curiosity and continuous learning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 