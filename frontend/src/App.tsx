import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="min-h-screen bg-gray-300 flex justify-center items-center">

      <div
        className="
          `w-97.5`
          `h-211`
          bg-white
          shadow-2xl
          rounded-[35px]
          overflow-hidden
        "
      >
        <AppRoutes />
      </div>

    </div>
  );
}

export default App;