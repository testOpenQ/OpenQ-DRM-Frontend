import CardMember from "./CardMember";

export default function CardMembers() {
  return (
    <div className="flex items-center justify-center -space-x-3 px-5 pt-3">
      <CardMember
        avatarUrl="https://avatars.githubusercontent.com/u/75732239"
        className="z-0 h-12 w-12"
      />
      <CardMember
        avatarUrl="https://avatars.githubusercontent.com/u/6792578"
        className="z-10 h-14 w-14"
      />
      <CardMember
        avatarUrl="https://avatars.githubusercontent.com/u/28826387"
        className="z-20 h-16 w-16"
      />
      <CardMember
        avatarUrl="https://avatars.githubusercontent.com/u/93455288"
        className="z-10 h-14 w-14"
      />
      <CardMember
        avatarUrl="https://avatars.githubusercontent.com/u/72156679"
        className="z-0 h-12 w-12"
      />
    </div>
  );
}
