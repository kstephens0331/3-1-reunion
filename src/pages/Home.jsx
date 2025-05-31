const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 text-center">
      {/* Top: Welcome message */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#E41E26]">Welcome to 3/1 Reunion Website</h1>
        <p className="text-lg text-[#000080]">Connecting past, present, and future.</p>
      </div>

      {/* Center: Mascot logo */}
      <div className="my-4">
        <img
          src="/assets/mascot-background_1.png"
          alt="3/1 Mascot"
          className="max-w-m md:max-w-m w-full h-auto"
        />
      </div>

      {/* Bottom: Battle history / legacy text */}
      <div className="mt-4 max-w-screen-md text-gray-700">
        <p>
          The 3rd Battalion, 1st Marines—"Thundering Third"—has a proud legacy of courage and dedication.
          From the Pacific campaigns of World War II to modern deployments, 3/1 has stood as a symbol of honor and service.
          Join us as we celebrate and remember the Marines who made it possible.
        </p>
      </div>
    </div>
  );
};

export default Home;
