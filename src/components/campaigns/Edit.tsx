import {
  type RepoModel,
  type UserModel,
  addRepo,
  addUser,
  deleteCampaign,
  getCampaign,
  OrgModel,
  addOrg,
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
import Image from "next/image";
import {
  fetchAllOrgRepos,
  fetchRepo,
  fetchUser,
  mapRestOrgToModel,
  mapRestRepoToModel,
  mapRestUserToModel,
} from "~/lib/github/rest";
import LoadingSpinner from "../LoadingSpinner";
import CSVUploadButton from "../CSVUploadButton";

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

  function handleContinue() {
    if (!campaign) return;

    repos.forEach((repo) => {
      addRepo(repo).catch(console.error);
    });

    users.forEach((user) => {
      addUser(user).catch(console.error);
    });

    orgs.forEach((org) => {
      addOrg(org).catch(console.error);
    });

    router.push(`/campaigns/${campaign.id}`).catch(console.error);
  }

  function addGithubUrlsFromText(text: string) {
    const GITHUB_URL_REGEX = /https?:\/\/github\.com(\/[\w-]+){1,2}/g;
    const githubUrls = text.match(GITHUB_URL_REGEX);

    if (!githubUrls) return;

    let newTextareaInput = textareaInput;
    if (textareaInput) {
      newTextareaInput += "\n";
    }
    newTextareaInput += githubUrls.join("\n");
    handleSetTextareaInput(newTextareaInput);
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

      <div className="mt-6 grid grid-cols-2 gap-3">
        {orgs.length > 0 && (
          <div>
            <h2 className="mb-2 text-xl font-bold text-indigo-700">
              Organizations
            </h2>
            <ul className="mb-3 list-inside list-none space-y-1">
              {orgs.map((org) => (
                <li
                  key={org.githubRestId}
                  className="flex items-center rounded-md bg-gray-800/20 px-2 py-1"
                >
                  <Image
                    src={org.avatarUrl}
                    width={20}
                    height={20}
                    alt="avatar"
                    className="mr-2 inline-block h-5 w-5 rounded-full"
                  />
                  {org.name}
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
                  className="flex items-center rounded-md bg-gray-800/20 px-2 py-1"
                >
                  <Image
                    src={user.avatarUrl}
                    width={20}
                    height={20}
                    alt="avatar"
                    className="mr-2 inline-block h-5 w-5 rounded-full"
                  />
                  {user.login}
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
                className="flex items-center rounded-md bg-gray-800/20 px-2 py-1"
              >
                <Image
                  src={repo.ownerAvatarUrl}
                  width={20}
                  height={20}
                  alt="avatar"
                  className="mr-2 inline-block h-5 w-5 rounded-full"
                />
                {repo.fullName}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex">
        <DiscreetButton
          onClick={() => handleDeleteCampaign(campaign.id)}
          className="hover:!bg-red-700"
        >
          cancel
        </DiscreetButton>
        <Button
          className="ml-auto"
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
