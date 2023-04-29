import {
  type RepoModel,
  type UserModel,
  addRepo,
  addUser,
  deleteCampaign,
  getCampaign,
  OrgModel,
  addOrg,
  updateCampaign,
} from "~/db";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import Button from "../base/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Textarea from "../base/Textarea";
import Headline from "../layout/Headline";
import { useRouter } from "next/router";
import DiscreetButton from "../base/DiscreetButton";
import { useSession } from "next-auth/react";
import useDebounce from "~/hooks/useDebounce";
import Image from "next/image";
import {
  fetchAllOrgRepos,
  fetchRepo,
  fetchUser,
  mapRestOrgToModel,
  mapRestRepoToModel,
  mapRestUserToModel,
  searchRepos,
} from "~/lib/github/rest";
import LoadingSpinner from "../LoadingSpinner";
import CSVUploadButton from "../CSVUploadButton";
import DepsUploadButton from "../DepsUploadButton";
import { isDepsJson } from "~/lib/types";

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

  const [orgs, setOrgs] = useState<OrgModel[]>([]);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [repos, setRepos] = useState<RepoModel[]>([]);
  const [notFoundUsers, setNotFoundUsers] = useState<string[]>([]);
  const [notFoundRepos, setNotFoundRepos] = useState<string[]>([]);

  const [isFetching, setIsFetching] = useState<boolean>(false);

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
    setOrgs([]);
    setNotFoundUsers([]);
    setNotFoundRepos([]);

    items.forEach((item) => {
      setIsFetching(true);
      if (item.includes("/")) {
        fetchRepo(item, accessToken)
          .then((repo) => {
            setRepos((repos) => [...repos, mapRestRepoToModel(repo)]);
          })
          .catch(() => {
            console.log("Not found repo", item);
            setNotFoundRepos((notFoundRepos) => [...notFoundRepos, item]);
          })
          .finally(() => {
            setIsFetching(false);
          });
      } else {
        fetchUser(item, accessToken)
          .then((user) => {
            if (user.type === "Organization") {
              setOrgs((orgs) => [...orgs, mapRestOrgToModel(user)]);

              fetchAllOrgRepos(item, accessToken)
                .then((orgRepos) => {
                  setRepos((repos) => [
                    ...repos,
                    ...orgRepos.map(mapRestRepoToModel),
                  ]);
                })
                .catch(() => {
                  console.log("Not found org repos", item);
                })
                .finally(() => {
                  setIsFetching(false);
                });
            } else {
              setUsers((users) => [...users, mapRestUserToModel(user)]);
            }
          })
          .catch(() => {
            console.log("Not found user/org", item);
            setNotFoundUsers((notFoundUsers) => [...notFoundUsers, item]);
          })
          .finally(() => {
            setIsFetching(false);
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

  async function handleContinue() {
    if (!campaign) return;

    for (const repo of repos) {
      const id = await addRepo(repo);
      campaign.repoIds.push(id);
    }

    for (const user of users) {
      const id = await addUser(user);
      campaign.userIds.push(id);
    }

    for (const org of orgs) {
      const id = await addOrg(org);
      campaign.orgIds.push(id);
    }

    await updateCampaign(campaign.id, campaign);

    router.push(`/campaigns/${campaign.id}`).catch(console.error);
  }

  function removeUser(user: UserModel) {
    setUsers((users) => users.filter((u) => u.login !== user.login));
  }

  function removeRepo(repo: RepoModel) {
    setRepos((repos) => repos.filter((r) => r.fullName !== repo.fullName));
  }

  function removeOrg(org: OrgModel) {
    setOrgs((orgs) => orgs.filter((o) => o.login !== org.login));
  }

  function addGithubUrlsFromText(text: string) {
    const GITHUB_URL_REGEX = /https?:\/\/github\.com(\/[\w-]+){1,2}/g;
    const githubUrls = text.match(GITHUB_URL_REGEX);

    if (!githubUrls) return;

    let newTextareaInput = textareaInput;
    if (textareaInput) {
      newTextareaInput += "\n";
    }
    newTextareaInput += githubUrls
      .map((url) => url.replace(/https?:\/\/github\.com\//, ""))
      .join("\n");
    handleSetTextareaInput(newTextareaInput);
  }

  function findReposByDeps(depsFile: string) {
    if (!accessToken) return;

    let deps: unknown;

    try {
      deps = JSON.parse(depsFile);
    } catch {
      console.log("Invalid JSON");
    }

    if (!deps) return;

    if (!isDepsJson(deps)) {
      return;
    }

    const depsNames = Object.keys(deps.dependencies);

    for (const depName of depsNames) {
      searchRepos(
        `${depName} filename:package extension:json`,
        deps.excludedRepos,
        accessToken
      ).then((foundRepos) => {
        setRepos((repos) => [...repos, ...foundRepos.map(mapRestRepoToModel)]);
      });
    }
  }

  if (!campaign) return <>Campaign does not exist.</>;

  return (
    <>
      <Headline>{campaign.name}</Headline>
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
        <div className="mt-2 flex justify-end">
          <CSVUploadButton onFileUpload={addGithubUrlsFromText} />
          <DepsUploadButton onFileUpload={findReposByDeps} />
        </div>
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

      <div className="mt-3 grid grid-cols-2 gap-3">
        {orgs.length > 0 && (
          <div>
            <h2 className="mb-2 text-xl font-bold text-indigo-700">
              Organizations
            </h2>
            <ul className="mb-3 list-inside list-none space-y-1">
              {orgs.map((org) => (
                <li
                  key={org.githubRestId}
                  className="flex items-center overflow-hidden rounded-md bg-gray-800/20 text-gray-400"
                >
                  <Image
                    src={org.avatarUrl}
                    width={20}
                    height={20}
                    alt="avatar"
                    className="mr-2 inline-block h-5 w-5 rounded-full"
                  />
                  {org.name}
                  <DiscreetButton
                    className="ml-auto rounded-none hover:!bg-gray-800/50 hover:text-red-600"
                    onClick={() => removeOrg(org)}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </DiscreetButton>
                </li>
              ))}
            </ul>
          </div>
        )}
        {users.length > 0 && (
          <div>
            <h2 className="mb-2 text-xl font-bold text-indigo-700">Users</h2>
            <ul className="list-inside list-none space-y-1">
              {users.map((user) => (
                <li
                  key={user.githubRestId}
                  className="flex items-center overflow-hidden rounded-md bg-gray-800/20 text-gray-400"
                >
                  <Image
                    src={user.avatarUrl}
                    width={20}
                    height={20}
                    alt="avatar"
                    className="mr-2 inline-block h-5 w-5 rounded-full"
                  />
                  {user.login}
                  <DiscreetButton
                    className="ml-auto rounded-none hover:!bg-gray-800/50 hover:text-red-600"
                    onClick={() => removeUser(user)}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </DiscreetButton>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {repos.length > 0 && (
        <div>
          <h2 className="mb-2 mt-3 text-xl font-bold text-indigo-700">
            Repositories
          </h2>
          <ul className="grid list-inside list-none grid-cols-2 gap-1">
            {repos.map((repo) => (
              <li
                key={repo.githubRestId}
                className="flex items-center overflow-hidden rounded-md bg-gray-800/20 text-gray-400"
              >
                <Image
                  src={repo.ownerAvatarUrl}
                  width={20}
                  height={20}
                  alt="avatar"
                  className="my-1 ml-2 mr-2 inline-block h-5 w-5 rounded-full"
                />
                {repo.fullName}
                <DiscreetButton
                  className="ml-auto rounded-none hover:!bg-gray-800/50 hover:text-red-600"
                  onClick={() => removeRepo(repo)}
                >
                  <XMarkIcon className="h-4 w-4" />
                </DiscreetButton>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex">
        <DiscreetButton
          onClick={() => handleDeleteCampaign(campaign.id)}
          className="ml-auto mr-3 hover:!bg-red-700"
        >
          cancel
        </DiscreetButton>
        <Button
          onClick={handleContinue}
          disabled={
            isFetching || orgs.length + repos.length + users.length === 0
          }
        >
          {isFetching && <LoadingSpinner className="mr-2" />}
          Create Campaign
        </Button>
      </div>
    </>
  );
}
