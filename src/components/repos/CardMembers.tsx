import CardMember from "./CardMember";

export default function CardMembers() {
  return (
    <div className="flex items-center justify-center -space-x-3 px-5 pt-3">
      <CardMember
        avatarUrl="https://avatars.githubusercontent.com/u/75732239"
        className="z-10 h-12 w-12"
      />
      <CardMember
        avatarUrl="https://avatars.githubusercontent.com/u/6792578"
        className="z-20 h-14 w-14"
      />
      <CardMember
        avatarUrl="https://avatars.githubusercontent.com/u/28826387"
        className="z-30 h-16 w-16"
      />
      <CardMember
        avatarUrl="https://avatars.githubusercontent.com/u/93455288"
        className="z-20 h-14 w-14"
      />
      <CardMember
        avatarUrl="https://avatars.githubusercontent.com/u/72156679"
        className="z-10 h-12 w-12"
      />
      <div
        className="z-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-600 bg-cover font-bold"
        style={{
          boxShadow: "0 0 0 1px #ccc, 0 0 5px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        +2
      </div>
    </div>
  );
}
