import CardMember from "./Member";

type Member = {
  avatarUrl: string;
};

export default function CardMembers({ members }: { members: Member[] }) {
  return (
    <div className="flex items-center justify-center -space-x-3 p-3">
      {members[0] && (
        <CardMember
          avatarUrl={members[0].avatarUrl}
          className="z-10 h-12 w-12"
        />
      )}
      {members[1] && (
        <CardMember
          avatarUrl={members[1].avatarUrl}
          className="z-20 h-14 w-14"
        />
      )}
      {members[2] && (
        <CardMember
          avatarUrl={members[2].avatarUrl}
          className="z-30 h-16 w-16"
        />
      )}
      {members[3] && (
        <CardMember
          avatarUrl={members[3].avatarUrl}
          className="z-20 h-14 w-14"
        />
      )}
      {members[4] && (
        <CardMember
          avatarUrl={members[4].avatarUrl}
          className="z-10 h-12 w-12"
        />
      )}
      {members.length > 5 && (
        <div
          className="z-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-600 bg-cover font-bold"
          style={{
            boxShadow: "0 0 0 1px #ccc, 0 0 5px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          +{members.length - 5}
        </div>
      )}
    </div>
  );
}
