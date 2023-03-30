import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { ChartPieIcon } from "@heroicons/react/24/outline";

export default function SidebarHeader({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center p-2 transition-all hover:bg-black/20">
            <div className="mr-3 rounded-lg bg-gray-600 p-1">
              <ChartPieIcon className="h-5 w-5 text-gray-300" />
            </div>
            {label}
            <ChevronUpIcon
              className={`${
                open ? "" : "rotate-180 transform"
              } ml-auto h-5 w-5 transition-all`}
            />
          </Disclosure.Button>

          <Transition
            enter="transition"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Disclosure.Panel>{children}</Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
