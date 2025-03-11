import { Grid, HelpCircle, MessageSquare, Rabbit, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 flex items-center justify-between border-b px-4 py-3 sm:px-6">
      <div className="flex items-center">
        <div className="mr-2 flex items-center">
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-gray-700">
            <Rabbit className="h-5 w-5 text-white" />
          </div>
          <span className="hidden text-xl font-medium text-gray-700 sm:inline">Sync Call</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="whitespace-nowrap text-xs text-gray-600 sm:text-sm">14:22 • Mon 10 Mar</div>
        <button className="rounded-full p-1 hover:bg-gray-100 sm:p-2">
          <HelpCircle className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
        </button>
        <button className="rounded-full p-1 hover:bg-gray-100 sm:p-2">
          <MessageSquare className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
        </button>
        <button className="rounded-full p-1 hover:bg-gray-100 sm:p-2">
          <Settings className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
        </button>
        <button className="rounded-full p-1 hover:bg-gray-100 sm:p-2">
          <Grid className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-200 sm:h-8 sm:w-8">
          <span className="text-xs font-medium sm:text-sm">U</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
