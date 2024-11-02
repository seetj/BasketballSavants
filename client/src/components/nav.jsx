export default function Navbar() {
  return (
    <nav class="bg-indigo-700 border-gray-200 dark:bg-gray-900">
      <div class="flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" class="flex justify-start items-center space-x-3">
          <img
            class="size-2/12"
            src="https://cdn.pixabay.com/photo/2019/06/10/15/11/basketball-4264543_640.png"
          />
          <span class="self-center text-2xl font-semibold whitespace-nowrap text-white dark:text-white">
            Basketball Savants
          </span>
        </a>
      </div>
    </nav>
  );
}
