import { EnvelopeIcon, GlobeEuropeAfricaIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import type { Repo } from "~/db";
import { RepoEvaluationResult } from "~/lib/github/repo/evaluate";

export default function DevelopersTab({
  repo,
  evaluationResult,
}: {
  repo: Repo;
  evaluationResult: RepoEvaluationResult;
}) {
  return (
    <div className="space-y-3 p-3">
      {evaluationResult.authors.map((author) => (
        <div key={author.user.login} className="flex items-center">
          <img
            src={author.user.avatarUrl}
            alt={author.user.login}
            className="mr-3 h-9 w-9 rounded-full"
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium">{author.user.login}</span>

            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-400">Commits:</span>
              <span className="text-xs text-gray-400">10</span>
            </div>
          </div>

          <div className="ml-auto grid grid-cols-4 gap-3 opacity-30">
            <div>
              {author.user.twitterUsername && (
                <Link
                  href={"https://twitter.com/" + author.user.twitterUsername}
                  target="_blank"
                >
                  <svg
                    className="h-8 w-8 text-gray-400 hover:text-gray-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.954 4.569c-.885.388-1.83.65-2.825.77 1.014-.611 1.794-1.574 2.164-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.174-1.559-3.59-1.559-2.717 0-4.92 2.203-4.92 4.92 0 .388.039.764.116 1.124C7.62 8.07 4.038 6.1 1.64 3.14c-.427.73-.67 1.574-.67 2.48 0 1.707.869 3.213 2.19 4.094-.807-.026-1.566-.247-2.228-.616v.062c0 2.385 1.693 4.374 3.946 4.82-.413.112-.848.174-1.296.174-.315 0-.62-.03-.92-.087.62 1.953 2.422 3.377 4.558 3.416-1.67 1.311-3.768 2.092-6.04 2.092-.39 0-.78-.023-1.17-.068 2.155 1.38 4.71 2.184 7.47 2.184 8.964 0 13.868-7.42 13.868-13.868 0-.21 0-.42-.015-.63.953-.69 1.787-1.56 2.444-2.548l-.047-.02z" />
                  </svg>
                </Link>
              )}
            </div>
            <div>
              {author.user.email && (
                <Link href={"mailto:" + author.user.email}>
                  <EnvelopeIcon className="h-8 w-8 text-gray-400 hover:text-gray-300" />
                </Link>
              )}
            </div>
            <div>
              {author.user.websiteUrl && (
                <Link
                  href={
                    "https://" +
                    author.user.websiteUrl.replace(/https?:\/\//g, "")
                  }
                  target="_blank"
                >
                  <GlobeEuropeAfricaIcon className="h-8 w-8 text-gray-400 hover:text-gray-300" />
                </Link>
              )}
            </div>
            <div>
              <Link
                href={"https://github.com/" + author.user.login}
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-gray-400"
                  fill="currentColor"
                >
                  <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
