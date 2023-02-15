import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import Cookies from "js-cookie";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { joinBetaWaitlist } from "../../apiHelper/joinBeta";

const WaitlistDialog = ({ isOpen, setIsOpen }: any) => {
  const [email, setEmail] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [joined, setJoined] = useState<boolean>(false);
  console.log(Cookies.get("___joined"));

  useEffect(() => {
    Cookies.get("___joined") === "1" ? setJoined(true) : setJoined(false);
  }, []);

  const handleSubmit = async (e: any) => {
    if (email) {
      e.preventDefault();
      try {
        setLoading(true);
        await joinBetaWaitlist({ email });
        toast.success("Thanks fo joining waitlist!");
        setJoined(true);
        Cookies.set("___joined", "1", { expires: 365 });
      } catch (e: any) {
        console.log(e);
        toast.error(e?.response?.data?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
        setTimeout(() => {
          setIsOpen(false);
        }, 1000);
      }
    } else {
      toast.error("Please enter a valid email address");
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 backdrop-blur-lg bg-black bg-opacity-60 transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="fixed inset-0 overflow-y-auto px-20 py-10 mobile:py-5 mobile:px-2 font-satoshi ">
            <div className="relative flex min-h-full items-center max-h-[calc(100vh-100px)] justify-center mobile:p-2 text-center mobile:items-start">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`relative flex mobile:flex-col mobile:justify-start justify-center rounded-2xl mobile:w-full mobile:max-h-full transform scrollbar-hide shadow-xl bg-white bg-opacity-20 transition-all group  max-w-[calc(100%-400px)] mobile:max-w-full`}
                >
                  <div className="p-6  flex flex-col w-full items-center mobile:w-full mobile:h-full mobile:overflow-y-auto">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-2 to-teal-500">
                      {joined ? (
                        <CheckCircleIcon className="w-8 h-8 text-white" />
                      ) : (
                        <UserPlusIcon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <h1 className="text-3xl font-[400] text-white my-3">
                      Join Beta Waitlist
                    </h1>
                    <p className="text-sm">
                      You'll get notified when we launch our AI Image genration
                      tool
                    </p>
                    <div className="w-full flex flex-col items-start my-5 gap-1">
                      <p className="text-md">Email</p>
                      <input
                        className="w-full text-white px-3 py-2 bg-blue-1 bg-opacity-50 focus:ring-2 focus:ring-blue-2 focus:ring-opacity-70 rounded-xl outline-none placeholder-gray-200"
                        placeholder="Provide email to get notified"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                    <button
                      className="flex items-center justify-center w-full h-10 rounded-xl bg-gradient-to-tr from-blue-2 to-teal-500"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="animate-ping p-2 rounded-full bg-white" />
                      ) : (
                        "Join"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default WaitlistDialog;
