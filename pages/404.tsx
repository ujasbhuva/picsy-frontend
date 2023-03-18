export default function Index() {
  return (
    <div className="w-full p-10 flex flex-col items-center font-satoshi mobile:p-5 h-screen bg-black-1">
      <img
        src={"/images/404.svg"}
        alt="NOT FOUND"
        className="object-cover w-[600px]"
      />
      <p className="text-2xl opacity-80 mt-40">
        SORRY! This page doesn't exist on server
      </p>
      <div className="flex underline text-blue-1 my-2">Go to image browser</div>
    </div>
  );
}
