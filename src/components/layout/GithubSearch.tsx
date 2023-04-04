import Input from "../base/Input";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Button from "../base/Button";
import useDebounce from "~/hooks/useDebounce";
import Image from "next/image";

export default function GithubSearch({
  onSelect,
}: {
  onSelect: (result: Record<string, any>) => void;
}) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Record<string, any>[]>([]);
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

  function handleSelectSearchResult(result: Record<string, any>) {
    onSelect(result);
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
      .then((res) => {
        if (!res.items) return;

        setSearchResults(res.items);
      })
      .catch(console.error);
  }, [debouncedSearchTerm, accessToken]);

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
          {searchResults.map((item) => (
            <Button
              key={item.node_id}
              onClick={() => handleSelectSearchResult(item)}
              className="!rounded-md"
            >
              <Image
                src={item.avatar_url || item.owner.avatar_url}
                alt="Avatar"
                width={24}
                height={24}
                className="mr-2 rounded-full"
              />
              <div className="truncate">{item.login || item.full_name}</div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
