import { type NextPage } from "next";
import Head from "next/head";
import Button from "~/components/base/Button";
import Input from "~/components/base/Input";
import Headline from "~/components/layout/Headline";

const Settings: NextPage = () => {
  return (
    <>
      <Head>
        <title>OpenQ DRM - Settings</title>
      </Head>
      <div className="max-w-3xl">
        <Headline>Settings</Headline>
        <h1 className="text-3xl font-bold text-indigo-700">ChatGPT</h1>
        <p className="mb-3 text-xl text-gray-400">
          Unlock valuable insights on your projects' progress with our
          pre-defined ChatGPT prompts! Get ready to elevate your analysis game!
        </p>
        <Button className="mx-auto mt-6 flex flex-col">
          <div>Upgrade to Pro Plan</div>
          <div className="font-normal text-indigo-300">($50/mth)</div>
        </Button>

        <h1 className="mt-12 text-3xl font-bold text-indigo-700">GitHub</h1>
        <p className="mb-3 text-xl text-gray-400">
          Your GitHub account serves as a means to access information from
          GitHub. However, please note that GitHub only permits a certain number
          of queries per hour and account. If you are using your account to
          query GitHub outside of OpenQ DRM, you can set a limit here.
        </p>
        <div className="my-6 flex items-center justify-center text-xl">
          <Input value="100" setValue={() => {}} className="mr-2 w-24" /> % of
          hourly limit
        </div>
        <p className="mb-3 text-xl text-gray-400">
          Consider upgrading to our Pro Plan for an enhanced experience with
          extended query limits. This allows you to access larger amounts of
          data more efficiently, without the constraints of hourly restrictions.
        </p>
        <Button className="mx-auto mt-6 flex flex-col">
          <div>Upgrade to Pro Plan</div>
          <div className="font-normal text-indigo-300">($50/mth)</div>
        </Button>

        <h1 className="mt-12 text-3xl font-bold text-indigo-700">Alerts</h1>
        <p className="mb-3 text-xl text-gray-400">
          Set up alerts to receive notifications when certain events occur. For
          example, you can set up an alert to notify you when the average
          activity in a repository changes significantly.
        </p>
        <Button className="mx-auto mt-6 flex flex-col">
          <div>Upgrade to Pro Plan</div>
          <div className="font-normal text-indigo-300">($50/mth)</div>
        </Button>
      </div>
    </>
  );
};

export default Settings;
