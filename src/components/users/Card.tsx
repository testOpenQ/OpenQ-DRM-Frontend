import {
  Scanner,
  type UserEvaluation,
  evaluateUserData,
  getLatestUserScan,
} from "@mktcodelib/github-insights";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import type { User } from "~/db";
import Button from "../base/Button";
import LoadingSpinner from "../LoadingSpinner";
import { FindEmailResponse } from "~/pages/api/find-email";

export default function Card({ user }: { user: User }) {
  const { data } = useSession();
  const accessToken = data?.accessToken;

  const [scanning, setScanning] = useState(false);
  const [userScanResult, setUserScanResult] = useState<UserEvaluation | null>(
    null
  );

  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [userEmailCandidates, setUserEmailCandidates] = useState<
    FindEmailResponse["candidates"] | undefined
  >(undefined);
  const [searchingEmail, setSearchingEmail] = useState(false);
  const [emailSearchError, setEmailSearchError] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!user) return;

    getLatestUserScan(user.login)
      .then((latestUserScan) => {
        if (latestUserScan) {
          if (latestUserScan.data && latestUserScan.data.user) {
            setUserScanResult(evaluateUserData(latestUserScan.data.user));
          }
        }
      })
      .catch((err) => console.error(err));
  }, [user, accessToken]);

  function scan() {
    if (!accessToken) {
      console.log("No access token set");
      return;
    }

    if (!user) {
      console.log("No user set");
      return;
    }

    const scanner = new Scanner({ viewerToken: accessToken });
    const scan = scanner.scanUser(user.login);

    setScanning(true);
    scan((data) => {
      setUserScanResult(evaluateUserData(data.user));
    })
      .catch((err) => console.log(err))
      .finally(() => {
        setScanning(false);
      });
  }

  async function findEmail() {
    if (!accessToken) {
      console.log("No access token set");
      return;
    }

    if (!user) {
      console.log("No user set");
      return;
    }

    setSearchingEmail(true);

    const userDataUrl = `https://api.github.com/users/${user.login}`;
    const userData = await fetch(userDataUrl, {
      headers: {
        Authorization: "token " + accessToken,
      },
    }).then((res) => res.json());

    if (userData.email) {
      setUserEmail(userData.email);
      setSearchingEmail(false);
      return;
    }

    try {
      const userReadmeUrl = `https://raw.githubusercontent.com/${user.login}/${user.login}/master/README.md`;
      userData.readme = await fetch(userReadmeUrl).then((res) => res.text());
    } catch (err) {
      console.log(
        `User ${user.login} doesn't seem to have a profile repository with a README.md.`
      );
    }

    fetch("/api/find-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((searchResult: FindEmailResponse) => {
        console.log(searchResult);
        const inputCost =
          (searchResult.totalConsumedTokens.input / 1000) * 0.03;
        const outputCost =
          (searchResult.totalConsumedTokens.output / 1000) * 0.06;
        console.log("$" + (inputCost + outputCost).toFixed(2));
        setUserEmailCandidates(searchResult.candidates);
        if (searchResult.error) {
          setEmailSearchError(searchResult.error);
        }
      })
      .catch(console.error)
      .finally(() => {
        setSearchingEmail(false);
      });
  }

  function handleSelectEmailCandidate(email: string) {
    setUserEmail(email);
    setUserEmailCandidates(undefined);
  }

  if (!user) return <>User does not exist.</>;

  return (
    <div className="flex flex-col rounded-lg bg-gray-800 p-3">
      <div className="mb-3 whitespace-nowrap font-bold">{user.login}</div>
      {userScanResult && (
        <>
          <p>
            Your repositories have received
            <span className="font-bold">
              {userScanResult.stargazerCount}
            </span>{" "}
            stars and have been forked
            <span className="font-bold">{userScanResult.forkCount}</span> times.
          </p>

          <p>
            Your followers&apos; repositories have received
            <span className="font-bold">
              {userScanResult.followersStargazerCount}
            </span>
            stars and have been forked
            <span className="font-bold">
              {userScanResult.followersForkCount}
            </span>{" "}
            times.
            <span className="font-bold">
              {userScanResult.followersFollowerCount}
            </span>
            people follow your followers.
          </p>

          <p>
            You contributed
            <span className="font-bold">
              {userScanResult.mergedPullRequestCount}
            </span>
            merged pull requests,
            <span className="font-bold">
              {userScanResult.mergedPullRequestCount365d}
            </span>
            in the last year and
            <span className="font-bold">
              {userScanResult.mergedPullRequestCount30d}
            </span>
            in the last 30 days.
          </p>
        </>
      )}
      {!userScanResult && (
        <>
          <div className="flex grow items-center justify-center">
            <Button className="w-full" onClick={scan}>
              {scanning && <LoadingSpinner className="mr-2" />}
              Scan
            </Button>
            <Button className="w-full" onClick={findEmail}>
              {searchingEmail && <LoadingSpinner className="mr-2" />}
              {userEmail || "Find email"}
            </Button>
          </div>
          {userEmailCandidates && userEmailCandidates.length === 0 && (
            <div>No email candidates found.</div>
          )}
          {userEmailCandidates && userEmailCandidates.length > 0 && (
            <div>
              {userEmailCandidates.map((candidate) => (
                <Button
                  key={candidate.email}
                  onClick={() => handleSelectEmailCandidate(candidate.email)}
                >
                  {candidate.email} ({candidate.confidence}: {candidate.reason})
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
