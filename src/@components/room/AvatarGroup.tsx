import { useMemo } from 'react';

const COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-teal-500',
];

interface User {
  name: string;
}

interface AvatarGroupProps {
  users: User[];
  maxAvatars?: number;
}

export default function AvatarGroup({ users, maxAvatars = 5 }: AvatarGroupProps) {
  const displayedUsers = users.slice(0, maxAvatars);
  const extraCount = Math.max(0, users.length - maxAvatars);

  const names = useMemo(() => {
    return users
      .map((user) => user.name)
      .slice(0, maxAvatars)
      .join(', ');
  }, [users, maxAvatars]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (index: number) => {
    return COLORS[index % COLORS.length];
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex -space-x-3">
        {displayedUsers.map((user, index) => (
          <div
            key={user.name + index}
            className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white ring-2 ring-white/50 transition-transform hover:z-10 hover:scale-110"
          >
            {user.name ? (
              <div
                key={user.name + index}
                className="relative h-full w-full overflow-hidden rounded-full border-2 border-white ring-2 ring-white/50 transition-transform hover:z-10 hover:scale-110"
              >
                <div className={`flex h-full w-full items-center justify-center ${getRandomColor(index)} text-white`}>
                  <span className="text-xs font-medium sm:text-sm">{getInitials(user.name)}</span>
                </div>
                <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/10" />
              </div>
            ) : (
              <div className={`flex h-full w-full items-center justify-center ${getRandomColor(index)} text-white`}>
                <span className="text-sm font-semibold">{getInitials(user.name)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 transition-colors hover:bg-black/10" />
          </div>
        ))}
        {extraCount > 0 && (
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gray-100 font-medium text-gray-600 ring-2 ring-white/50 transition-transform hover:scale-110">
            +{extraCount}
          </div>
        )}
      </div>
      {names && (
        <p className="text-center text-sm text-gray-600">
          {names}
          {extraCount > 0 ? ` and ${extraCount} more` : ''}
        </p>
      )}
    </div>
  );
}
