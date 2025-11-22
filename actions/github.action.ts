'use server';

export async function fetchGithubRepos(githubUrl: string | null) {
  if (!githubUrl) return [];

  try {
    // 1. Extract username from URL (handles http, https, www, and trailing slashes)
    const username = githubUrl.split('github.com/').pop()?.split('/')[0];

    if (!username) return [];

    // 2. Fetch from GitHub API
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=public`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      return [];
    }

    const repos = await response.json();

    // 3. Return cleaned data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      url: repo.html_url,
      updated_at: repo.updated_at
    }));

  } catch (error) {
    console.error("GitHub Fetch Error:", error);
    return [];
  }
}