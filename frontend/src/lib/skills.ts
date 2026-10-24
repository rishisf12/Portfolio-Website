export type SkillLike = {
  id?: number;
  name: string;
  level?: string;
  domain?: string | null;
  category?: string | null;
};

export type SkillGroup = {
  domain: string;
  skills: SkillLike[];
};

// Display order for the domain groups on the public site.
export const SKILL_DOMAINS = [
  "Languages",
  "Frontend",
  "Backend",
  "Full Stack",
  "Databases",
  "Machine Learning",
  "Deep Learning",
  "Design",
  "Mechanical Engineering",
];

const FALLBACK_DOMAIN = "Other";

export function groupByDomain(skills: SkillLike[]): SkillGroup[] {
  const buckets = new Map<string, SkillLike[]>();

  for (const skill of skills) {
    const domain = (skill.domain || "").trim() || FALLBACK_DOMAIN;
    const bucket = buckets.get(domain);
    if (bucket) bucket.push(skill);
    else buckets.set(domain, [skill]);
  }

  const known = SKILL_DOMAINS.filter((domain) => buckets.has(domain)).map((domain) => ({
    domain,
    skills: buckets.get(domain)!,
  }));

  const extra = [...buckets.keys()]
    .filter((domain) => !SKILL_DOMAINS.includes(domain) && domain !== FALLBACK_DOMAIN)
    .sort()
    .map((domain) => ({ domain, skills: buckets.get(domain)! }));

  const other = buckets.has(FALLBACK_DOMAIN)
    ? [{ domain: FALLBACK_DOMAIN, skills: buckets.get(FALLBACK_DOMAIN)! }]
    : [];

  return [...known, ...extra, ...other];
}

export function isTechnicalDomain(domain: string): boolean {
  return domain !== "Design" && domain !== "Mechanical Engineering" && domain !== FALLBACK_DOMAIN;
}
