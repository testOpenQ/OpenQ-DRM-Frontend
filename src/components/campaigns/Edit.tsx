import {
  RepoModel,
  UserModel,
  addRepo,
  addUser,
  deleteCampaign,
  getCampaign,
} from "~/db";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import Button from "../base/Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import Textarea from "../base/Textarea";
import Headline from "../layout/Headline";
import { useRouter } from "next/router";
import DiscreetButton from "../base/DiscreetButton";
import { useSession } from "next-auth/react";
import useDebounce from "~/hooks/useDebounce";

export default function EditCampaign({ campaignId }: { campaignId: string }) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const router = useRouter();
  const campaign = useLiveQuery(getCampaign(campaignId));

  const INITIAL_INPUT_ROWS = 4;
  const [textareaInput, setTextareaInput] = useState<string>("");
  const debouncedTextareaInput = useDebounce(textareaInput, 1000);
  const [textareaInputRows, setTextareaInputRows] =
    useState<number>(INITIAL_INPUT_ROWS);

  const [users, setUsers] = useState<UserModel[]>([]);
  const [repos, setRepos] = useState<RepoModel[]>([]);
  const [notFoundUsers, setNotFoundUsers] = useState<string[]>([]);
  const [notFoundRepos, setNotFoundRepos] = useState<string[]>([]);

  function handleSetTextareaInput(value: string) {
    setTextareaInput(value);
    const rows = value.split("\n");
    setTextareaInputRows(Math.max(rows.length + 1, INITIAL_INPUT_ROWS));
  }

  useEffect(() => {
    if (!accessToken) return;
    if (!campaign) return;

    const items = textareaInput
      .split("\n")
      .filter(Boolean)
      .map((url) => url.trim())
      .map((url) => url.replace(/https?:\/\/github\.com\/?/g, ""));

    setUsers([]);
    setRepos([]);
    setNotFoundUsers([]);
    setNotFoundRepos([]);

    items.forEach((item) => {
      if (item.includes("/")) {
        fetch(`https://api.github.com/repos/${item}`, {
          headers: {
            Authorization: "token " + accessToken,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.message === "Not Found") {
              throw new Error("Not Found");
            }

            return res;
          })
          .then((repo) => {
            setRepos((repos) => [
              ...repos,
              {
                githubRestId: repo.id,
                githubGraphqlid: repo.node_id,
                name: repo.name,
                fullName: repo.full_name,
                private: repo.private,
                ownerLogin: repo.owner.login,
                ownerAvatarUrl: repo.owner.avatar_url,
                description: repo.description,
                fork: repo.fork,
                createdAt: repo.created_at,
                updatedAt: repo.updated_at,
                pushedAt: repo.pushed_at,
                homepage: repo.homepage,
                size: repo.size,
                stargazersCount: repo.stargazers_count,
                watchersCount: repo.watchers_count,
                language: repo.language,
                hasIssues: repo.has_issues,
                hasProjects: repo.has_projects,
                hasDiscussions: repo.has_discussions,
                forksCount: repo.forks_count,
                archived: repo.archived,
                disabled: repo.disabled,
                openIssuesCount: repo.open_issues_count,
                license: repo.license,
                topics: repo.topics,
                visibility: repo.visibility,
                defaultBranch: repo.default_branch,
                subscribersCount: repo.subscribers_count,
                campaignId: campaign.id,
              },
            ]);
          })
          .catch(() => {
            console.log("Not found repo", item);
            setNotFoundRepos((notFoundRepos) => [...notFoundRepos, item]);
          });
      } else {
        fetch(`https://api.github.com/users/${item}`, {
          headers: {
            Authorization: "token " + accessToken,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.message === "Not Found") {
              throw new Error("Not Found");
            }

            return res;
          })
          .then((user) => {
            setUsers((users) => [
              ...users,
              {
                login: user.login,
                restId: user.id,
                graphqlId: user.node_id,
                avatarUrl: user.avatar_url,
                gravatarId: user.gravatar_id,
                name: user.name,
                company: user.company,
                blog: user.blog,
                location: user.location,
                email: user.email,
                hireable: user.hireable,
                bio: user.bio,
                twitterUsername: user.twitter_username,
                followers: user.followers,
                following: user.following,
                created_at: user.created_at,
                updated_at: user.updated_at,
                campaignId: campaign.id,
              },
            ]);
          })
          .catch(() => {
            console.log("Not found user", item);
            setNotFoundUsers((notFoundUsers) => [...notFoundUsers, item]);
          });
      }
    });
  }, [debouncedTextareaInput]);

  function handleDeleteCampaign(id: number) {
    router
      .push("/")
      .then(() => deleteCampaign(id))
      .catch((err) => console.log(err));
  }

  function handleContinue() {
    if (!campaign) return;

    repos.forEach((repo) => {
      addRepo(repo).catch(console.error);
    });

    users.forEach((user) => {
      addUser(user).catch(console.error);
    });

    router.push(`/campaigns/${campaign.id}`).catch(console.error);
  }

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <>
      <Headline>
        {campaign.name}
        <div className="ml-auto flex">
          <DiscreetButton
            onClick={() => handleDeleteCampaign(campaign.id)}
            className="hover:!bg-red-700"
          >
            <TrashIcon className="h-5 w-5" />
          </DiscreetButton>
        </div>
      </Headline>
      <h1 className="text-3xl font-bold text-indigo-700">
        Add users and repositories to your campaign.
      </h1>
      <div className="mt-6 mb-3">
        <Textarea
          rows={textareaInputRows}
          value={textareaInput}
          setValue={handleSetTextareaInput}
          placeholder={`https://github.com/org/repo\nhttps://github.com/user\norg/repo\nuser`}
        />
      </div>
      {(users.length > 0 || repos.length > 0) && (
        <>
          <div className="flex">
            <Button className="ml-auto" onClick={handleContinue}>
              Continue
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {notFoundRepos.length + notFoundUsers.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-yellow-700">Not found</h2>
                <ul className="list-inside list-none space-y-1">
                  {notFoundRepos.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                  {notFoundUsers.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {repos.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-indigo-700">
                  Repositories
                </h2>
                <ul className="list-inside list-none space-y-1">
                  {repos.map((repo) => (
                    <li key={repo.githubRestId}>
                      <img
                        src={repo.ownerAvatarUrl}
                        className="mr-1 inline-block h-5 w-5 rounded-full"
                      />
                      {repo.fullName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {users.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-indigo-700">Users</h2>
                <ul className="list-inside list-none space-y-1">
                  {users.map((user) => (
                    <li key={user.restId}>
                      <img
                        src={user.avatarUrl}
                        className="mr-1 inline-block h-5 w-5 rounded-full"
                      />
                      {user.login}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
