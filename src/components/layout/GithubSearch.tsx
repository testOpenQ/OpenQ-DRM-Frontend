import Input from "../base/Input";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Button from "../base/Button";
import useDebounce from "~/hooks/useDebounce";
import Image from "next/image";

export type RepoSearchResult = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
};

export type UserSearchResult = {
  id: number;
  node_id: string;
  login: string;
  avatar_url: string;
  bio: string;
  html_url: string;
};

function isRepoSearchResult(item: unknown): item is RepoSearchResult {
  return typeof item === "object" && item !== null && "owner" in item;
}

function isUserSearchResult(item: unknown): item is UserSearchResult {
  return typeof item === "object" && item !== null && "login" in item;
}

export default function GithubSearch({
  onSelect,
}: {
  onSelect: (item: UserSearchResult | RepoSearchResult) => void;
}) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    (UserSearchResult | RepoSearchResult)[]
  >([]);
  const [searchType, setSearchType] = useState<"users" | "repos">("users");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data } = useSession();
  const accessToken = data?.accessToken;

  function handleSignIn() {
    signIn("github").catch(console.error);
  }

  function handleSetSearchType(type: "users" | "repos") {
    setSearchResults([]);
    setSearchType(type);
  }

  function handleSelectSearchResult(item: UserSearchResult | RepoSearchResult) {
    onSelect(item);
    setSearchResults([]);
    setSearchTerm("");
  }

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setSearchResults([]);
      return;
    }
    if (!accessToken) return;

    let sanitizedSearchTerm = debouncedSearchTerm;

    if (searchType === "repos" && !debouncedSearchTerm.includes("/")) {
      sanitizedSearchTerm = sanitizedSearchTerm + "/";
    }

    const url =
      searchType === "users"
        ? `https://api.github.com/search/users?q=${sanitizedSearchTerm}+type:user`
        : `https://api.github.com/search/repositories?q=${sanitizedSearchTerm}`;

    fetch(url, {
      headers: {
        Authorization: "token " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((res: unknown) => {
        if (
          !res ||
          typeof res !== "object" ||
          !("items" in res) ||
          !Array.isArray(res.items) ||
          !res.items.every(
            (item: unknown) =>
              isRepoSearchResult(item) || isUserSearchResult(item)
          )
        )
          throw new Error("Unknown GitHub API response");

        setSearchResults(res.items);
      })
      .catch(console.error);
  }, [searchType, debouncedSearchTerm, accessToken]);

  return (
    <div className="group relative flex space-x-3">
      <Input
        value={searchTerm}
        setValue={setSearchTerm}
        placeholder={`Search for ${searchType}...`}
        className={`${accessToken ? "" : "cursor-not-allowed opacity-20"} grow`}
        disabled={!accessToken}
      />
      {(accessToken && (
        <div className="flex flex-1">
          <Button
            disabled={searchType === "users"}
            className="rounded-r-none"
            onClick={() => handleSetSearchType("users")}
          >
            Users
          </Button>
          <Button
            disabled={searchType === "repos"}
            className="rounded-l-none"
            onClick={() => handleSetSearchType("repos")}
          >
            Repositories
          </Button>
        </div>
      )) || (
        <Button className="flex-1" onClick={handleSignIn}>
          Connect
        </Button>
      )}
      {searchResults && searchResults.length > 0 && (
        <div className="absolute mt-12 hidden max-h-64 grid-cols-3 gap-1 overflow-auto rounded-md border border-gray-600 bg-gray-800 p-1 group-focus-within:grid">
          {searchResults.map((item) => {
            const avatarUrl = isRepoSearchResult(item)
              ? item.owner.avatar_url
              : item.avatar_url;
            const name = isRepoSearchResult(item) ? item.full_name : item.login;

            return (
              <Button
                key={item.node_id}
                onClick={() => handleSelectSearchResult(item)}
                className="!rounded-md"
              >
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={24}
                  height={24}
                  className="mr-2 rounded-full"
                />
                <div className="truncate">{name}</div>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
