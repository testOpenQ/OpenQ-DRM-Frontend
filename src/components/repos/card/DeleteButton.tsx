import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import Button from "~/components/base/Button";
import DiscreetButton from "~/components/base/DiscreetButton";
import { Repo, deleteRepo } from "~/db";

export default function DeleteButton({ repo }: { repo: Repo }) {
  let [isOpen, setIsOpen] = useState(false);

  function closeConfirmModal() {
    setIsOpen(false);
  }

  function openConfirmModal() {
    setIsOpen(true);
  }

  function handleDeleteRepo() {
    deleteRepo(repo.id).catch(console.error);
    closeConfirmModal();
  }

  return (
    <>
      <DiscreetButton onClick={openConfirmModal}>
        <XMarkIcon className="h-4 w-4" />
      </DiscreetButton>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeConfirmModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm backdrop-filter" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete {repo.fullName}?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You can add the repository back at any time.
                    </p>
                  </div>

                  <div className="mt-4 flex">
                    <DiscreetButton
                      onClick={closeConfirmModal}
                      className="!text-gray-400 hover:!bg-gray-200"
                    >
                      Cancel
                    </DiscreetButton>
                    <Button onClick={handleDeleteRepo} className="ml-auto">
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
