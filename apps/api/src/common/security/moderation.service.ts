import { Injectable, Logger } from "@nestjs/common";
import sanitizeHtml from "sanitize-html";

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  private readonly restrictedKeywords = [
    "investment advice",
    "buy now",
    "guaranteed returns",
    "pump and dump",
    "financial advisor",
  ];

  /**
   * Alias for backwards compatibility with CommunityService
   */
  async sanitizeAndValidate(content: string): Promise<string> {
    const res = await this.moderateContent(content);
    return res.safeContent;
  }

  generateAnonymousAlias(): string {
    const adjectives = ["Golden", "Silver", "Brazen", "Swift", "Silent"];
    const nouns = ["Bull", "Bear", "Eagle", "Wolf", "Whale"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj}${noun}${Math.floor(1000 + Math.random() * 9000)}`;
  }

  async moderateContent(content: string): Promise<{
    safeContent: string;
    isFlagged: boolean;
    flaggedReasons: string[];
  }> {
    const safeContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "br"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        a: ["href", "name", "target"],
        img: ["src", "alt", "width", "height"],
      },
      transformTags: {
        a: (tagName: string, attribs: any) => {
          return {
            tagName,
            attribs: {
              ...attribs,
              rel: "nofollow noopener noreferrer",
              target: "_blank",
            },
          };
        },
      },
    });

    const flaggedReasons: string[] = [];
    const lowerContent = safeContent.toLowerCase();

    for (const keyword of this.restrictedKeywords) {
      if (lowerContent.includes(keyword)) {
        flaggedReasons.push(`Restricted keyword found: ${keyword}`);
      }
    }

    return {
      safeContent,
      isFlagged: flaggedReasons.length > 0,
      flaggedReasons,
    };
  }
}
