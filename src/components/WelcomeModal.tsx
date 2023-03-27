import { Dialog, Transition } from '@headlessui/react'
import { addCampaign } from '@mktcodelib/github-insights'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import Button from './base/Button'
import Input from './base/Input'

export default function WelcomeModal() {
  const router = useRouter()
  
  const [isOpen, setIsOpen] = useState(true)
  const [campaignName, setCampaignName] = useState("")

  function closeModal() {
    setIsOpen(false)
  }

  function handleAddCampaign() {
    setCampaignName("")
    addCampaign(campaignName)
      .then((id) => {
        router.push(`/campaigns/${id.toString()}`).catch((err) => console.log(err))
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Create your first campaign
                  </Dialog.Title>
                  <p className="text-sm text-gray-400 mt-2">
                    A campaign is a collection of repositories and users that you want to track.
                  </p>
                  <div className="mt-6">
                    <Input value={campaignName} setValue={setCampaignName} placeholder="My first campaign" />
                  </div>

                  <div className="mt-4">
                    <Button onClick={handleAddCampaign} disabled={campaignName.length === 0}>
                      Continue
                      <div className='ml-auto mr-1 group-hover:mr-0 group-disabled:mr-1 transition-all'>→</div>
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
