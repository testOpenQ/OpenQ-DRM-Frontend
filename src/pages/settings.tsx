import { useSession } from "next-auth/react";
import Head from "next/head";
import Button from "~/components/base/Button";
import Input from "~/components/base/Input";
import Headline from "~/components/layout/Headline";

export default function SettingsPage() {
  const { data } = useSession();

  const user = data?.user;

  if (!user) return null;

  return (
    <>
      <Head>
        <title>OpenQ DRM - Settings</title>
      </Head>
      <Headline>Settings</Headline>
      <div className="mt-6 flex">
        <div>
          <h1 className="mb-3 text-3xl font-bold text-indigo-700">ChatGPT</h1>
          <p className="text-xl text-gray-400">
            &ldquo;Unlock valuable insights on your projects&apos; progress with
            our pre-defined ChatGPT prompts! Get ready to elevate your analysis
            game!&rdquo;
          </p>
          <div className="mb-3 text-right italic text-gray-600">
            ChatGPT 4, Apr 5<sup>th</sup> 2023
          </div>

          <h1 className="mt-12 mb-3 text-3xl font-bold text-indigo-700">
            GitHub
          </h1>
          <p className="mb-3 text-xl text-gray-400">
            Your GitHub account <span className="italic">{user.name}</span>{" "}
            serves as a means to access information from GitHub. However, please
            note that GitHub only permits a certain number of queries per hour
            and account. If you are using your account to query GitHub outside
            of OpenQ DRM, you can set a limit here.
          </p>
          <div className="my-6 flex items-center justify-center text-xl">
            <Input value="100" setValue={() => {}} className="mr-2 !w-24" /> %
            of hourly limit
          </div>
          <p className="mb-3 text-xl text-gray-400">
            Consider upgrading to our Pro Plan for an enhanced experience with
            extended query limits. This allows you to access larger amounts of
            data more efficiently, without the constraints of hourly
            restrictions.
          </p>

          <h1 className="mt-12 mb-3 text-3xl font-bold text-indigo-700">
            Data Storage
          </h1>
          <p className="mb-3 text-xl text-gray-400">
            By default, your data is stored locally on your computer,
            specifically within your browser. This means you cannot access your
            analysis data from another device. To enjoy the flexibility of
            accessing your data from any device, you may choose to upgrade to
            our pro plan and store it on our servers too.
          </p>

          <h1 className="mt-12 mb-3 text-3xl font-bold text-indigo-700">
            Alerts
          </h1>
          <p className="mb-3 text-xl text-gray-400">
            Set up alerts to receive notifications when certain events occur,
            like significant changes in the average activity in a repository.
          </p>
        </div>
        <div className="ml-12">
          <div className="w-max max-w-sm rounded-lg bg-gray-800 p-4 shadow sm:p-8">
            <h5 className="mb-4 text-xl font-medium text-gray-400">Pro plan</h5>
            <div className="flex items-baseline text-white">
              <span className="text-3xl font-semibold">$</span>
              <span className="text-5xl font-extrabold tracking-tight">
                149
              </span>
              <span className="ml-1 text-xl font-normal text-gray-400">
                /month
              </span>
            </div>
            <ul role="list" className="my-7 space-y-5">
              <li className="flex space-x-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Check icon</title>
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="text-base font-normal leading-tight text-gray-400">
                  Add team members
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Check icon</title>
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="text-base font-normal leading-tight text-gray-400">
                  10 GB cloud storage
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Check icon</title>
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="text-base font-normal leading-tight text-gray-400">
                  No API rate limitation
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Check icon</title>
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="text-base font-normal leading-tight text-gray-400">
                  ChatGPT Integration
                </span>
              </li>
              <li className="flex space-x-3">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Check icon</title>
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="text-base font-normal leading-tight text-gray-400">
                  Alerts &amp; Notifications
                </span>
              </li>
            </ul>
            <Button className="w-full justify-center !p-4 text-xl">
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
