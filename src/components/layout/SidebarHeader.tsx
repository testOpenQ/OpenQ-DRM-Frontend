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
          <Disclosure.Button
            className={`group flex items-center p-2 text-gray-300 transition-all hover:bg-gray-900 hover:text-gray-100 ${
              open ? "bg-gray-900" : ""
            }`}
          >
            <div className="mr-3 rounded-lg p-1.5">
              <ChartPieIcon
                className={`h-5 w-5 transition-all group-hover:text-gray-300 ${
                  open ? "text-gray-300" : "text-gray-600"
                }`}
              />
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
            <Disclosure.Panel className="bg-gray-900/30 text-sm">
              {children}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
