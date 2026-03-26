import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import {
  changelogEntries,
  changelogFeedback,
  comments,
  feedback,
  feedbackEmbeddings,
  statusChanges,
} from "../src/db/schema";
import { embedTexts } from "../src/lib/embed-text";

const withEmbeddings = process.argv.includes("--with-embeddings");

dotenv.config({ path: ".env.local" });

if (!process.env["DATABASE_URL"]) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(process.env["DATABASE_URL"]);
const db = drizzle({ client: sql });

const seedData: (typeof feedback.$inferInsert)[] = [
  // ── Creator feedback ──────────────────────────────────────────────
  {
    title: "Bulk schedule content across multiple days",
    description:
      "As a creator, I want to schedule posts for the entire week in one session. Currently I have to set each post individually which is really time-consuming when I'm batch-creating content.",
    category: "creator",
    status: "planned",
    voteCount: 87,
    createdAt: new Date("2026-01-12"),
  },
  {
    title: "Revenue analytics dashboard with trends",
    description:
      "I need better visibility into my earnings over time. Monthly trends, subscriber growth rate, and which content drives the most tips would help me make better decisions about what to create.",
    category: "creator",
    status: "completed",
    voteCount: 203,
    createdAt: new Date("2025-12-20"),
  },
  {
    title: "Collaborative content with other creators",
    description:
      "Would love the ability to co-create content with another creator and split the revenue. Joint livestreams, shared posts, or collaboration pages would open up a lot of creative possibilities.",
    category: "creator",
    status: "requested",
    voteCount: 45,
    createdAt: new Date("2026-02-28"),
  },
  {
    title: "Custom welcome message for new subscribers",
    description:
      "When someone subscribes, I want to send an automatic personalised welcome message. It helps with retention and makes the fan feel valued from day one.",
    category: "creator",
    status: "planned",
    voteCount: 156,
    createdAt: new Date("2026-01-22"),
  },
  {
    title: "Tip leaderboard on creator profiles",
    description:
      "A leaderboard showing top tippers on my profile would gamify the experience and encourage more engagement. Fans who tip generously get recognition, and it creates a fun competitive element.",
    category: "creator",
    status: "rejected",
    voteCount: 23,
    createdAt: new Date("2026-02-14"),
  },
  {
    title: "Allow creators to set up multi-tier subscription bundles",
    description:
      "Right now subscription management is really basic. I want to be able to create multiple tiers with different price points, each offering different levels of content access. Fans should be able to see exactly what they get at each level before subscribing. There should also be an option for free trials so fans can try a tier before committing.",
    category: "creator",
    status: "requested",
    voteCount: 38,
    createdAt: new Date("2026-03-15"),
  },
  {
    title: "Content watermarking for leak protection",
    description:
      "I need a way to protect my exclusive content from being shared outside the platform. Invisible watermarks tied to the subscriber who downloaded it would be a huge deterrent and help me track leaks back to the source.",
    category: "creator",
    status: "in_progress",
    voteCount: 178,
    createdAt: new Date("2026-02-01"),
  },
  {
    title: "Audio-only posts for voice messages",
    description:
      "Not all content needs to be visual. I'd love to post audio clips — personal voice messages, behind-the-scenes commentary, or mini podcast episodes — directly on my profile without needing to attach a video.",
    category: "creator",
    status: "requested",
    voteCount: 52,
    createdAt: new Date("2026-03-08"),
  },
  {
    title: "Automated DM replies for common questions",
    description:
      "I get the same questions over and over in DMs — pricing, posting schedule, collaboration enquiries. An auto-reply feature with customisable templates would save me hours every week.",
    category: "creator",
    status: "planned",
    voteCount: 112,
    createdAt: new Date("2026-01-18"),
  },
  {
    title: "Pin important posts to profile top",
    description:
      "I want to pin my best-performing or most important posts to the top of my profile so new visitors see them first. Right now great content gets buried as I post new things.",
    category: "creator",
    status: "completed",
    voteCount: 340,
    createdAt: new Date("2025-12-05"),
  },
  {
    title: "Real-time subscriber count on dashboard",
    description:
      "The subscriber count on my dashboard only updates once a day. I'd like to see real-time numbers, especially during promotional campaigns when I'm actively watching growth.",
    category: "creator",
    status: "requested",
    voteCount: 29,
    createdAt: new Date("2026-03-18"),
  },
  {
    title: "Mass messaging to subscriber tiers",
    description:
      "I want to send targeted messages to specific subscriber tiers — for example, a thank-you to my top-tier supporters or a promo to my free-tier followers to encourage upgrades.",
    category: "creator",
    status: "under_review",
    voteCount: 95,
    createdAt: new Date("2026-02-10"),
  },

  // ── Fan feedback ──────────────────────────────────────────────────
  {
    title: "Better creator discovery for new fans",
    description:
      "The explore page could do a much better job surfacing creators that match my interests. A recommendation algorithm based on what I've already subscribed to would help me find new creators I'd actually enjoy.",
    category: "fan",
    status: "under_review",
    voteCount: 134,
    createdAt: new Date("2026-01-05"),
  },
  {
    title: "Dark mode for messaging",
    description:
      "The messaging interface is painfully bright when using the app at night. A dark mode option for DMs would be really appreciated — the rest of the app already supports it.",
    category: "fan",
    status: "completed",
    voteCount: 2400,
    createdAt: new Date("2025-11-15"),
  },
  {
    title: "Bookmark favourite posts for later",
    description:
      "Sometimes I see content I want to revisit but there's no way to save it. A simple bookmark or favourites feature would let me build a personal collection of posts I love.",
    category: "fan",
    status: "requested",
    voteCount: 67,
    createdAt: new Date("2026-03-01"),
  },
  {
    title: "Improve video loading speed on mobile",
    description:
      "Videos take a long time to buffer on mobile, especially longer ones. Adaptive bitrate streaming or better compression would make the viewing experience much smoother.",
    category: "fan",
    status: "completed",
    voteCount: 1100,
    createdAt: new Date("2025-12-10"),
  },
  {
    title: "Gift a subscription to a friend",
    description:
      "I'd love to be able to buy a subscription to my favourite creator as a gift for a friend. It's a great way to support creators and share content I enjoy with people I know.",
    category: "fan",
    status: "requested",
    voteCount: 91,
    createdAt: new Date("2026-03-10"),
  },
  {
    title: "Push notifications for favourite creators",
    description:
      "I want to get notified the moment my favourite creators post something new. Right now I have to keep checking the app manually. A push notification toggle per creator would be perfect.",
    category: "fan",
    status: "in_progress",
    voteCount: 267,
    createdAt: new Date("2026-01-08"),
  },
  {
    title: "Download purchased content for offline viewing",
    description:
      "When I'm travelling or don't have reliable internet, I'd love to download content I've paid for and view it offline. This would make the subscription feel much more valuable.",
    category: "fan",
    status: "requested",
    voteCount: 183,
    createdAt: new Date("2026-02-15"),
  },
  {
    title: "Comment reactions with emoji",
    description:
      "Sometimes I want to react to a comment without writing a full reply. Simple emoji reactions like hearts, laughs, or thumbs up would make comment sections feel more interactive and lively.",
    category: "fan",
    status: "requested",
    voteCount: 76,
    createdAt: new Date("2026-03-12"),
  },
  {
    title: "Improved search within a creator's content",
    description:
      "Once you're subscribed to a creator with hundreds of posts, finding something specific is nearly impossible. A search bar within a creator's profile that filters by keywords, dates, or content type would be really useful.",
    category: "fan",
    status: "under_review",
    voteCount: 143,
    createdAt: new Date("2026-01-25"),
  },
  {
    title: "Subscription price comparison tool",
    description:
      "Before subscribing I want to compare what different creators offer at similar price points. A comparison view showing content frequency, perks, and subscriber reviews would help me decide.",
    category: "fan",
    status: "rejected",
    voteCount: 18,
    createdAt: new Date("2026-02-20"),
  },
  {
    title: "Creator content calendar preview",
    description:
      "I'd like to see an upcoming content calendar from creators I follow — a simple preview of what's planned for the week or month. It would help me decide whether to stay subscribed or upgrade tiers.",
    category: "fan",
    status: "planned",
    voteCount: 88,
    createdAt: new Date("2026-01-30"),
  },
  {
    title: "Multiple payment methods support",
    description:
      "Right now I can only pay with one card. I'd like to add multiple payment methods and choose which one to use per subscription. Also, Apple Pay and Google Pay would make checkout much faster.",
    category: "fan",
    status: "completed",
    voteCount: 520,
    createdAt: new Date("2025-11-20"),
  },
  {
    title: "Exclusive live stream events with countdown",
    description:
      "Creators should be able to schedule exclusive live streams with a countdown timer visible to subscribers. Building anticipation with a countdown and reminders would make live events feel more special.",
    category: "fan",
    status: "requested",
    voteCount: 145,
    createdAt: new Date("2026-03-14"),
  },
  {
    title: "Notification digest — daily summary email",
    description:
      "Instead of getting pinged for every update, I'd prefer a daily digest email summarising all new posts, messages, and activity from creators I follow. Less noise, same value.",
    category: "fan",
    status: "requested",
    voteCount: 62,
    createdAt: new Date("2026-03-16"),
  },
];

type StatusValue = (typeof feedback.$inferSelect)["status"];

const statusHistories: Record<
  string,
  { from: StatusValue; to: StatusValue; daysAfterCreation: number }[]
> = {
  // ── Existing items ────────────────────────────────────────────────
  "Bulk schedule content across multiple days": [
    { from: "requested", to: "under_review", daysAfterCreation: 7 },
    { from: "under_review", to: "planned", daysAfterCreation: 21 },
  ],
  "Better creator discovery for new fans": [
    { from: "requested", to: "under_review", daysAfterCreation: 14 },
  ],
  "Revenue analytics dashboard with trends": [
    { from: "requested", to: "under_review", daysAfterCreation: 10 },
    { from: "under_review", to: "planned", daysAfterCreation: 25 },
    { from: "planned", to: "in_progress", daysAfterCreation: 45 },
    { from: "in_progress", to: "completed", daysAfterCreation: 70 },
  ],
  "Dark mode for messaging": [
    { from: "requested", to: "under_review", daysAfterCreation: 5 },
    { from: "under_review", to: "planned", daysAfterCreation: 14 },
    { from: "planned", to: "in_progress", daysAfterCreation: 30 },
    { from: "in_progress", to: "completed", daysAfterCreation: 60 },
  ],
  "Custom welcome message for new subscribers": [
    { from: "requested", to: "under_review", daysAfterCreation: 10 },
    { from: "under_review", to: "planned", daysAfterCreation: 28 },
  ],
  "Improve video loading speed on mobile": [
    { from: "requested", to: "under_review", daysAfterCreation: 7 },
    { from: "under_review", to: "planned", daysAfterCreation: 20 },
    { from: "planned", to: "in_progress", daysAfterCreation: 40 },
    { from: "in_progress", to: "completed", daysAfterCreation: 65 },
  ],
  "Tip leaderboard on creator profiles": [
    { from: "requested", to: "under_review", daysAfterCreation: 5 },
    { from: "under_review", to: "rejected", daysAfterCreation: 12 },
  ],

  // ── New items ─────────────────────────────────────────────────────
  "Content watermarking for leak protection": [
    { from: "requested", to: "under_review", daysAfterCreation: 10 },
    { from: "under_review", to: "planned", daysAfterCreation: 25 },
    { from: "planned", to: "in_progress", daysAfterCreation: 40 },
  ],
  "Automated DM replies for common questions": [
    { from: "requested", to: "under_review", daysAfterCreation: 14 },
    { from: "under_review", to: "planned", daysAfterCreation: 30 },
  ],
  "Pin important posts to profile top": [
    { from: "requested", to: "under_review", daysAfterCreation: 7 },
    { from: "under_review", to: "planned", daysAfterCreation: 18 },
    { from: "planned", to: "in_progress", daysAfterCreation: 35 },
    { from: "in_progress", to: "completed", daysAfterCreation: 55 },
  ],
  "Mass messaging to subscriber tiers": [
    { from: "requested", to: "under_review", daysAfterCreation: 12 },
  ],
  "Push notifications for favourite creators": [
    { from: "requested", to: "under_review", daysAfterCreation: 10 },
    { from: "under_review", to: "planned", daysAfterCreation: 20 },
    { from: "planned", to: "in_progress", daysAfterCreation: 35 },
  ],
  "Improved search within a creator's content": [
    { from: "requested", to: "under_review", daysAfterCreation: 18 },
  ],
  "Subscription price comparison tool": [
    { from: "requested", to: "under_review", daysAfterCreation: 8 },
    { from: "under_review", to: "rejected", daysAfterCreation: 15 },
  ],
  "Creator content calendar preview": [
    { from: "requested", to: "under_review", daysAfterCreation: 12 },
    { from: "under_review", to: "planned", daysAfterCreation: 26 },
  ],
  "Multiple payment methods support": [
    { from: "requested", to: "under_review", daysAfterCreation: 5 },
    { from: "under_review", to: "planned", daysAfterCreation: 15 },
    { from: "planned", to: "in_progress", daysAfterCreation: 30 },
    { from: "in_progress", to: "completed", daysAfterCreation: 50 },
  ],
};

const commentSeedData: {
  feedbackTitle: string;
  comments: {
    authorName: string;
    content: string;
    daysAfterCreation: number;
  }[];
}[] = [
  {
    feedbackTitle: "Dark mode for messaging",
    comments: [
      {
        authorName: "NightOwlFan",
        content:
          "This is my number one request. I literally avoid using DMs at night because the white background is blinding.",
        daysAfterCreation: 3,
      },
      {
        authorName: "CreatorJess",
        content:
          "Agreed — I spend hours messaging fans and the bright interface gives me headaches. Even a simple toggle would be amazing.",
        daysAfterCreation: 8,
      },
      {
        authorName: "MobileUser42",
        content:
          "So glad this is finally shipped! The transition is smooth and it remembers my preference. Great work, team.",
        daysAfterCreation: 65,
      },
    ],
  },
  {
    feedbackTitle: "Better creator discovery for new fans",
    comments: [
      {
        authorName: "NewToFanvue",
        content:
          "I signed up last week and the explore page feels random. I had to search specific names my friends gave me. A 'similar creators' suggestion would help so much.",
        daysAfterCreation: 5,
      },
      {
        authorName: "ContentExplorer",
        content:
          "Even just tags or categories you can browse would be a big improvement. Right now it's hard to find creators outside the trending list.",
        daysAfterCreation: 12,
      },
    ],
  },
  {
    feedbackTitle: "Bulk schedule content across multiple days",
    comments: [
      {
        authorName: "BusyCreator",
        content:
          "I batch-create on Sundays and spend more time scheduling than creating. A calendar drag-and-drop view would be the dream.",
        daysAfterCreation: 4,
      },
      {
        authorName: "ScheduleQueen",
        content:
          "Even a simple 'repeat this post schedule' option would save me a lot of time. I post at the same times every week.",
        daysAfterCreation: 15,
      },
    ],
  },
  {
    feedbackTitle: "Revenue analytics dashboard with trends",
    comments: [
      {
        authorName: "DataDrivenCreator",
        content:
          "The current earnings page is just a single number. I have no idea which content is performing well or what drives tip spikes.",
        daysAfterCreation: 7,
      },
      {
        authorName: "FullTimeCreator",
        content:
          "This is essential for anyone doing this as a career. I need to track growth and forecast income — spreadsheets are not sustainable.",
        daysAfterCreation: 20,
      },
      {
        authorName: "AnalyticsPro",
        content:
          "The new dashboard is brilliant. The CSV export is a lifesaver for my accountant. One suggestion: add a comparison view for month-over-month.",
        daysAfterCreation: 75,
      },
    ],
  },
  {
    feedbackTitle: "Bookmark favourite posts for later",
    comments: [
      {
        authorName: "CasualFan",
        content:
          "I scroll through so much content and always lose track of posts I wanted to revisit. A simple heart or bookmark icon would be perfect.",
        daysAfterCreation: 2,
      },
      {
        authorName: "PowerUser",
        content:
          "Would be great if bookmarks could be organised into folders or collections too. I follow a lot of creators across different niches.",
        daysAfterCreation: 10,
      },
    ],
  },
  {
    feedbackTitle: "Push notifications for favourite creators",
    comments: [
      {
        authorName: "SuperFan99",
        content:
          "I keep missing posts from my favourite creator because I don't check the app frequently enough. Push notifications would solve this completely.",
        daysAfterCreation: 3,
      },
      {
        authorName: "QuietFollower",
        content:
          "Please make sure it's opt-in per creator though. I follow 20+ creators and don't want to be spammed with notifications for all of them.",
        daysAfterCreation: 9,
      },
      {
        authorName: "CreatorMike",
        content:
          "From a creator perspective, this would be amazing for engagement. My live streams get much better turnout when fans know in advance.",
        daysAfterCreation: 18,
      },
    ],
  },
  {
    feedbackTitle: "Content watermarking for leak protection",
    comments: [
      {
        authorName: "ProtectMyWork",
        content:
          "I've had content leaked twice this year. Invisible watermarks that trace back to the subscriber would be a game-changer for accountability.",
        daysAfterCreation: 5,
      },
      {
        authorName: "CreatorRights",
        content:
          "This should be a platform-wide default, not an opt-in. Content theft is the biggest issue facing creators right now.",
        daysAfterCreation: 14,
      },
    ],
  },
  {
    feedbackTitle: "Download purchased content for offline viewing",
    comments: [
      {
        authorName: "TravelFan",
        content:
          "I take long flights regularly and would love to watch content offline. Even just caching recently viewed posts would help.",
        daysAfterCreation: 4,
      },
      {
        authorName: "RuralUser",
        content:
          "My internet is unreliable, so buffering is a constant issue. Offline access would make my subscription feel worth it even on bad days.",
        daysAfterCreation: 11,
      },
    ],
  },
  {
    feedbackTitle: "Pin important posts to profile top",
    comments: [
      {
        authorName: "ProfileOptimiser",
        content:
          "I have an intro video that explains what my page is about but it's buried under months of other posts. Pinning would fix this instantly.",
        daysAfterCreation: 6,
      },
      {
        authorName: "NewCreator2026",
        content:
          "Love this feature now that it's live! I pinned my welcome post and my conversion rate from profile visitors to subscribers went up noticeably.",
        daysAfterCreation: 60,
      },
    ],
  },
  {
    feedbackTitle: "Gift a subscription to a friend",
    comments: [
      {
        authorName: "GenerousFan",
        content:
          "My friend's birthday is coming up and I'd love to gift her a subscription to a creator we both follow. This would be such a thoughtful gift option.",
        daysAfterCreation: 2,
      },
      {
        authorName: "CreatorAdvocate",
        content:
          "From a creator standpoint, gifting would be a powerful growth tool. Fans become ambassadors when they can share what they love.",
        daysAfterCreation: 7,
      },
    ],
  },
];

const changelogSeedData: {
  title: string;
  description: string;
  publishedAt: Date;
  linkedFeedbackTitles: string[];
}[] = [
  {
    title: "Dark mode now available in messaging",
    description:
      "We've rolled out full dark mode support for the messaging interface. All DM conversations, group chats, and media previews now respect your dark mode preference. This was one of our most requested features with over 2,400 votes — thank you for the feedback!",
    publishedAt: new Date("2026-01-14"),
    linkedFeedbackTitles: ["Dark mode for messaging"],
  },
  {
    title: "Faster video playback on mobile",
    description:
      "We've implemented adaptive bitrate streaming for all video content on mobile devices. Videos now start playing faster and automatically adjust quality based on your connection speed. Buffering times have been reduced by up to 60% in our testing.",
    publishedAt: new Date("2026-02-20"),
    linkedFeedbackTitles: ["Improve video loading speed on mobile"],
  },
  {
    title: "Creator analytics improvements",
    description:
      "The new revenue analytics dashboard is here. Track your monthly earnings trends, subscriber growth rate, and see which content drives the most tips. We've also added exportable CSV reports for your records.",
    publishedAt: new Date("2026-03-05"),
    linkedFeedbackTitles: [
      "Revenue analytics dashboard with trends",
      "Pin important posts to profile top",
      "Multiple payment methods support",
    ],
  },
  {
    title: "Pinned posts for creator profiles",
    description:
      "Creators can now pin up to three posts to the top of their profile. Pinned posts stay visible regardless of how much new content is published, making it easy to highlight introductions, best work, or important announcements for new visitors.",
    publishedAt: new Date("2026-03-10"),
    linkedFeedbackTitles: ["Pin important posts to profile top"],
  },
  {
    title: "Apple Pay, Google Pay, and multi-card support",
    description:
      "Checkout just got faster. We now support Apple Pay and Google Pay for instant subscriptions, and you can save multiple payment methods to your account. Choose which card to use per subscription, and switch anytime from your settings.",
    publishedAt: new Date("2026-03-18"),
    linkedFeedbackTitles: ["Multiple payment methods support"],
  },
];

async function seed() {
  console.log("Seeding database...");

  await db.delete(changelogEntries);
  await db.delete(feedback);

  const allFeedback = await db.insert(feedback).values(seedData).returning();
  console.log(`  Inserted ${allFeedback.length} feedback items`);

  const feedbackByTitle = new Map(allFeedback.map((f) => [f.title, f]));

  const statusChangeRows: (typeof statusChanges.$inferInsert)[] = [];

  for (const item of allFeedback) {
    const history = statusHistories[item.title];
    if (!history) continue;

    for (const change of history) {
      const changedAt = new Date(item.createdAt);
      changedAt.setDate(changedAt.getDate() + change.daysAfterCreation);

      statusChangeRows.push({
        feedbackId: item.id,
        fromStatus: change.from,
        toStatus: change.to,
        changedAt,
      });
    }
  }

  if (statusChangeRows.length > 0) {
    await db.insert(statusChanges).values(statusChangeRows);
  }
  console.log(`  Inserted ${statusChangeRows.length} status changes`);

  const commentRows: (typeof comments.$inferInsert)[] = [];

  for (const { feedbackTitle, comments: itemComments } of commentSeedData) {
    const item = feedbackByTitle.get(feedbackTitle);
    if (!item) continue;

    for (const comment of itemComments) {
      const createdAt = new Date(item.createdAt);
      createdAt.setDate(createdAt.getDate() + comment.daysAfterCreation);

      commentRows.push({
        feedbackId: item.id,
        authorName: comment.authorName,
        content: comment.content,
        createdAt,
      });
    }
  }

  if (commentRows.length > 0) {
    await db.insert(comments).values(commentRows);
  }
  console.log(`  Inserted ${commentRows.length} comments`);

  const allChangelog = await db
    .insert(changelogEntries)
    .values(
      changelogSeedData.map(({ title, description, publishedAt }) => ({
        title,
        description,
        publishedAt,
      })),
    )
    .returning();

  const changelogLinks: (typeof changelogFeedback.$inferInsert)[] = [];

  for (const [i, { linkedFeedbackTitles }] of changelogSeedData.entries()) {
    const entry = allChangelog[i];
    if (!entry) continue;
    for (const feedbackTitle of linkedFeedbackTitles) {
      const item = feedbackByTitle.get(feedbackTitle);
      if (item) {
        changelogLinks.push({
          changelogEntryId: entry.id,
          feedbackId: item.id,
        });
      }
    }
  }

  if (changelogLinks.length > 0) {
    await db.insert(changelogFeedback).values(changelogLinks);
  }
  console.log(
    `  Inserted ${allChangelog.length} changelog entries with ${changelogLinks.length} links`,
  );

  if (withEmbeddings) {
    console.log("Generating embeddings...");

    for (const item of allFeedback) {
      const [titleEmbedding, descriptionEmbedding] = await embedTexts([
        item.title,
        item.description ?? "",
      ]);

      await db
        .insert(feedbackEmbeddings)
        .values({ feedbackId: item.id, titleEmbedding, descriptionEmbedding })
        .onConflictDoUpdate({
          target: feedbackEmbeddings.feedbackId,
          set: { titleEmbedding, descriptionEmbedding },
        });

      console.log(`  Embedded: ${item.title.slice(0, 60)}`);
    }

    console.log(`  Generated ${allFeedback.length} embeddings`);
  }

  console.log(
    `\nDone! Seeded ${allFeedback.length} feedback items, ${statusChangeRows.length} status changes, ${commentRows.length} comments, ${allChangelog.length} changelog entries, and ${changelogLinks.length} changelog links.`,
  );
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
